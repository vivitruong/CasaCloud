const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { handleValidationErrors,isProperUser, isUpdateBooking, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//Get all Bookings for a Spot based on the Spot's id (done)
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId)
    //coulndt find a spot
    if(!spot) {
        res.status(404).json({ message: "Spot coulnd't be found"})
    } else {
        //check if you are not the owner
        const owner = spot.ownerId;
        if(userId !== owner) {
            const userBooking = await Booking.findAll({
                where: {
                    [Op.and]: [
                        { userId },
                        { spotId }
                    ]
                },
                attributes: {
                    exclude: ['id', 'userId', 'createdAt', 'updatedAt']
                }
            });
            res.json({
                'Bookings': userBooking
            })
        }
        //check if you are the owner
        if(userId === owner) {
            const ownerBooking = await Booking.findAll({
                where: {
                    spotId
                },
                raw: true
            });
            for (let booking of ownerBooking) {
                const user = await User.findByPk(booking.userId, {
                    attributes: {
                        exclude: ['username', 'createdAt', 'updatedAt']
                    }
                });
                booking.User = user;
            }
            res.json({
                'Bookings': ownerBooking
            })
        }
    }
})

//get all booking current user (done)
router.get('/current', requireAuth, async (req, res, next) => {
    const id = req.user.id;

    const bookings = await Booking.findAll({
        where: {
            userId: id
        },
        raw: true
    });
    for (let booking of bookings) {
        const spot = await Spot.findOne({
            where: {
                id: booking.spotId
            },
            raw: true
        });

        const spotImages = await SpotImage.findAll({
            where: {
                [Op.and]: [
                    {
                        spotId: booking.spotId,
                    },
                    {
                        preview: true
                    }
                ]
            },
            attributes: ['url'],
            raw: true
        });
        if (!spotImages.length) {
            spot.previewImage = null
        } else {
            spot.previewImage = spotImages[0]['url'];
        }
        booking.Spot = spot;

    }
    res.json({
        "Bookings": bookings
    });
});

// Edit a booking (done)
router.put('/:bookingId', requireAuth, isUpdateBooking, async (req, res, next) => {
    try {
      const bookingId = req.params.bookingId;
      const updateBooking = await Booking.findByPk(bookingId);

      // Check if booking exists
      if (!updateBooking) {
        return res.status(404).json({
          message: "Booking couldn't be found",
          statusCode: 404
        });
      }

      const spotId = updateBooking.spotId;
      let { startDate, endDate } = req.body;
      let today = new Date();
      let startDateValue = new Date(startDate);
      let endDateValue = new Date(endDate);

      if (endDateValue.getTime() <= startDateValue.getTime()) {
        return res.status(400).json({
          message: "Validation error",
          statusCode: 400,
          errors: {
            endDate: "endDate cannot be on or before startDate"
          }
        });
      }

      if (endDateValue.getTime() <= today.getTime()) {
        return res.status(403).json({
          message: "Past bookings can't be modified",
          statusCode: 403
        });
      }

      const bookings = await Booking.findAll({
        where: {
          spotId
        },
        raw: true
      });

      for (let booking of bookings) {
        let startValue = new Date(booking.startDate);
        let endValue = new Date(booking.endDate);
        if (booking.id !== +bookingId) {
          if (!(endDateValue.getTime() <= startValue.getTime() || startDateValue.getTime() >= endValue.getTime())) {
            return res.status(403).json({
              message: "Sorry, this spot is already booked for the specified dates",
              statusCode: 403,
              errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
              }
            });
          }
        }
      }

      if (startDate) {
        updateBooking.startDate = startDate;
      }
      if (endDate) {
        updateBooking.endDate = endDate;
      }
      await updateBooking.save();
      return res.json(updateBooking);
    } catch (error) {
      next(error);
    }
  });

//Delete a booking (done)
router.delete('/:bookingId', requireAuth, isProperUser, async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const deleteBooking = await Booking.findByPk(bookingId);
    if (new Date(deleteBooking.startDate).getTime() < new Date().getTime()) {
        return res.status(403).json(
            {
                "message": "Bookings that have been started can't be deleted",
                "statusCode": 403
            }
        )
    }
    await deleteBooking.destroy();
    res.json(
        {
        "message": "Successfully deleted",
        "statusCode": 200
        }
    );
});
module.exports = router;
