const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//get all current user booking
router.get('/currentuser', requireAuth, async(req, res, next) => {
    const userId = req.user.id

    let Bookings = await Booking.findAll({
        where: { userId },
              include: [{
                model: Listing,
                as: 'Listing',
              }],
    })

    let bookArr = []

    for (let booking of Bookings) {

        let Spotty = await Listing.findOne({
            where: { id: booking.listingId },
            raw: true,
            attributes: ["id", "hostId", "address", "city", "state", "country", "name", "price"]
        })

        let prev = await Image.findOne({
            where: {
                listingId: booking.listingId,
                previewImage: true
            }


        })
        if (prev) {
            Spotty.previewImage = prev.url
        }
        if (!prev) { Spotty.previewImage = null }


        let realBooking = {
            id: booking.id,
            listingId: booking.listingId,
            Listing: Spotty,
            userId: booking.userId,
            checkIn: booking.checkIn, // Updated to use the correct property name
            checkOut: booking.checkOut, // Updated to use the correct property name
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt

        }

        bookArr.push(realBooking)
    }

    res.json({ Bookings: bookArr })

    // try {
    //     const userId = req.user.id;

    //     const bookings = await Booking.findAll({
    //       where: { userId },
    //       include: [{
    //         model: Listing,
    //         as: 'Listing',
    //       }],
    //     });

    //     const formattedBookings = bookings.map(booking => ({
    //       id: booking.id,
    //       listingId: booking.listingId,
    //       Listing: {
    //         id: booking.Listing.id,
    //         ownerId: booking.Listing.hostId,
    //         address: booking.Listing.address,
    //         city: booking.Listing.city,
    //         state: booking.Listing.state,
    //         country: booking.Listing.country,
    //         lat: booking.Listing.lat,
    //         lng: booking.Listing.lng,
    //         name: booking.Listing.name,
    //         price: booking.Listing.price,
    //         previewImage: booking.Listing.previewImage
    //       },
    //       userId: booking.userId,
    //       checkIn: booking.checkIn, // Updated to use the correct property name
    //       checkOut: booking.checkOut, // Updated to use the correct property name
    //       createdAt: booking.createdAt,
    //       updatedAt: booking.updatedAt
    //     }));

    //     return res.status(200).json({ Bookings: formattedBookings });
    //   } catch (error) {
    //     return next(error);
    //   }
    }); // still get null and preview image is wrong


// Edit a booking
router.put('/:id', requireAuth, async( req, res, next) => {
    const bookingId = req.params.id;
    const updateBooking = await Booking.findByPk(bookingId);
    console.log(updateBooking)
    const listId = updateBooking.listingId;
    console.log(listId)
    let { checkIn, checkOut } = req.body;
    let today = new Date();
    let checkInDate = new Date(checkIn);
    let checkOutDate = new Date(checkOut)

    //check the date if valid
    if(checkOutDate.getTime() <= checkInDate.getTime()){
         return res.status(400).json({
            message: "Bad Request",
            error: {
                checkIn : "check In date cannot come before check Out"
            }
         })
    }

    //check past booking
    if(checkOutDate.getTime() <= today.getTime()) {
        return res.status(403).json({
            message: "Past booking cannot be modified"
        })
    }
    //check if this lisiting has already been booked
    let bookings = await Booking.findAll({
        where: {
            listId
        },
        raw: true
    });
    for(let booking of bookings) {
        let start = new Date(booking.checkIn);
        let end = new Date(booking.checkOut);
        if(booking.id !== bookingId) {
            if(!(checkInDate.getTime() <= start.getTime() || checkOutDate.getTime() >= end.getTime())){
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    error: {
                        checkIn: "Start date conflicts with an existing booking",
                        checkOut: "End date conflicts with an existing booking"
                    }
                })
            }
        }
    }
    if(checkIn) {
        updateBooking.checkIn = checkIn
    } ;
    if(checkOut) {
        updateBooking.checkOut = checkOut
    }
    await updateBooking.save();
    return res.json(updateBooking)

})
//Delete a booking (cannot deleted anything bescuase it keeo saying booking coulnd be found)
router.delete('/:id', requireAuth, async (req, res, next) => {
    const bookingId = req.params.id;
    const {user} = req;

    if(!user) return res.status(404).json({
        message: "Authentication required"
    })
    let currBooking = await Booking.findOne({ where : { id : bookingId}})
    if(!currBooking) {
         return res.status(404).json({
            message: "Booking could't be found"
         })
    }
    let checkBooking = currBooking.toJSON();

    let list = await Listing.findOne({ where : { id : checkBooking.listingId}, raw: true})
    let host = list.hostId;

    if(checkBooking.userId !== user.dataValues.id && host !== user.dataValues.id) {
        return res.json(403).json({
            message: "Forbidden"
        })
    }

    if(checkBooking.listId <= new Date()) {
        return res.status(403).json({
            message: "Bookings that have been started cannot be deleted"
        })
    }

    await currBooking.destroy();
    res.status(200).json({
        message: "Succesfully deleted"
    })
});
module.exports = router;
