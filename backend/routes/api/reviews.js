const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { isReviewer, handleValidationErrors,isOwner, handleListValidations, checkReviewRating, validateBooking} = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();


//Delete a review
router.delete('/:reviewId', requireAuth,isReviewer, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const deleteReview = await Review.findByPk(reviewId);
    await deleteReview.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

//Edit a review
router.put('/:reviewId', requireAuth, checkReviewRating, async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const updateReview = await Review.findByPk(reviewId);
        const { user } = req;
        if(!user) return res.status(401).json({message: "You have to log in"});

        if (!updateReview) {
          return res.status(404).json({ message: "Review not found" });
        }

        const { review, stars } = req.body;

        if (review) {
          updateReview.review = review;
        }

        if (stars) {
          updateReview.stars = stars;
        }

        await updateReview.save();

        res.json(updateReview);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }

})
//Get all Reviews of the Current User (reviewImage is empty [])
router.get('/current', requireAuth, async (req, res, next) => {
    const id = req.user.id;
    const reviews = await Review.findAll({
        where: {
            userId: id
        },
        raw: true
    });
    for (let review of reviews) {
        const user = await User.findOne({
            where: {
                id
            },
            attributes: {
                        exclude: ['username', 'hashedPassword', 'createdAt', 'updatedAt', 'email']
                    }

        });
        review.User = user;
        const spots = await Spot.findAll({
            where: {
                ownerId: id
            },
            raw: true
        });
        for (let spot of spots) {
            const spotImages = await SpotImage.findAll({
                where: {
                    [Op.and]: [
                        {
                            spotId: spot.id,
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
            if (!spotImages.length) {
                spot.previewImage = null
            } else {
                spot.previewImage = spotImages[0]['url'];
            }
        }
        review.Spot = spots;
        const images = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: {
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            },
            raw: true
        });
        review.ReviewImages = images
    }
    res.json({"Reviews": reviews });
});


module.exports = router;
