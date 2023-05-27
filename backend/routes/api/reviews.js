const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { isReviewer, handleValidationErrors,isOwner, handleListValidations, checkReviewRating, validateBooking} = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//Add an Image to a Review based on the Review's id (done)
router.post('/:reviewId/images', requireAuth , isReviewer, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        }
    });
    if (reviewImages.length === 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        })
    }
    const { url } = req.body;
    const reviewImage = await ReviewImage.create({
        reviewId,
        url,
    });
    const imageData = await ReviewImage.scope('defaultScope').findByPk(reviewImage.id)
    res.json(imageData);
})



//Delete a review (done)
router.delete('/:reviewId', requireAuth,isReviewer, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const deleteReview = await Review.findByPk(reviewId);
    await deleteReview.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

//Edit a review (done)
router.put('/:reviewId', requireAuth, isReviewer, checkReviewRating, async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
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
//Get all Reviews of the Current User (done)
router.get('/current', requireAuth, async (req, res, next) => {
    const id = req.user.id;
    const Reviews = await Review.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          as: "ReviewImages",
          attributes: ["id", "url"],
        },
      ],
    });

    const resArr = [];
    for (let i = 0; i < Reviews.length; i++) {
      const review = Reviews[i].toJSON();
      const spotId = review.spotId;
      const spot = await Spot.findOne({
        where: { id: spotId },
        raw: true,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      const previewImage = await SpotImage.findAll({
        where: {
          spotId: spotId,
          preview: true,
        },
        attributes: ["url"],
      });

      spot.previewImage = previewImage.length > 0 ? previewImage[previewImage.length - 1].url : null;
      review.Spot = [spot];
      resArr.push(review);
    }

    res.json({ Reviews: resArr });


});

module.exports = router;
