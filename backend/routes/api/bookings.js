const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
const booking = require('../../db/models/booking');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//get all current user booking
router.get('/currentuser', requireAuth, async(req, res, next) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.findAll({
          where: { userId },
          include: [{
            model: Listing,
            as: 'Listing',
          }],
        });

        const formattedBookings = bookings.map(booking => ({
          id: booking.id,
          listingId: booking.listingId,
          Listing: {
            id: booking.Listing.id,
            ownerId: booking.Listing.hostId,
            address: booking.Listing.address,
            city: booking.Listing.city,
            state: booking.Listing.state,
            country: booking.Listing.country,
            lat: booking.Listing.lat,
            lng: booking.Listing.lng,
            name: booking.Listing.name,
            price: booking.Listing.price,
            previewImage: booking.Listing.previewImage
          },
          userId: booking.userId,
          checkIn: booking.checkIn, // Updated to use the correct property name
          checkOut: booking.checkOut, // Updated to use the correct property name
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        }));

        return res.status(200).json({ Bookings: formattedBookings });
      } catch (error) {
        return next(error);
      }
    }); // still get null and preview image is wrong

// Edit a booking
module.exports = router;
