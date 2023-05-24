const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { handleValidationErrors,isProperUser, isUpdateBooking, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//get all current user booking only show []
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId
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
            attributes: {
                exclude: ['id', 'preview']
            },
            raw: true
        });
        spot.previewImage = spotImages.length ? spotImages[0]['url'] : null;

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

//Delete a booking (cannot deleted anything bescuase it keeo saying booking coulnd be found)
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
