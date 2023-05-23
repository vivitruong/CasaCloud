const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleBodyValidations, checkReviewRating, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();


//Delete a review
router.delete('/:id', requireAuth, restoreUser, async (req, res, next) => {
    const currentUser = req.user.id;
    const reviewId = req.params.id;
    const deleteReview = await Review.findByPk(reviewId);

    if (!currentUser) return res.status(401).json({ "message": "You're not logged in"})

    if(deleteReview) {
        await deleteReview.destroy();
        res.json({message: "Successfully deleted"})
    } else {
        res.status(404).json({ message: "Review couldnt be found"})
    }

})
//Edit a review (done)
router.put('/:id', requireAuth, checkReviewRating, async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const updateReview = await Review.findByPk(reviewId);
        const { user } = req;
        if(!user) return res.status(401).json({message: "You have to log in"});

        if (!updateReview) {
          return res.status(404).json({ message: "Review not found" });
        }

        const { review, rating } = req.body;

        if (review) {
          updateReview.review = review;
        }

        if (rating) {
          updateReview.rating = rating;
        }

        await updateReview.save();

        res.json(updateReview);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }

})
//Get all Reviews of the Current User
router.get('/currentuser', requireAuth, async (req, res, next) => {
    const review = await Review.findAll({
        where: { userId: req.user.id},
        include : [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Listing,
                attributes: ['id', 'hostId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage']
            },
            {
                model: Image,
                scope: 'Review',
                attributes: ['id','url', 'previewImage', 'imageableId', 'imageableType']
            }
        ],
    });
    return res.json({review});
})

module.exports = router;
