const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { ReviewImage, Review} = require('../../db/models');

// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//middle waere function to find if review belong to current user (done)
const isReviewImage = async (req, res, next) => {
    const userId = req.user.id;
    const reviewImageId = req.params.imageId;
    const reviewImage = await ReviewImage.findByPk(reviewImageId, {
        attributes: ['reviewId']
    });
    if (!reviewImage) {
        res.status(404).json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    } else {
        const reviewId = reviewImage.reviewId;
        const review = await Review.findByPk(reviewId);
        const userReviewId = review.userId;
        if (userId === userReviewId) {
            next();
        } else {
            const err = new Error('Unauthorized');
            err.message = 'You did not write this review';
            err.status = 403;
            next(err);
        }
    }
}
//delete an image for a Listing (done)
router.delete('/:imageId', requireAuth, isReviewImage, async(req, res, next) => {
    const reviewImageId = req.params.imageId;
    const reviewImage = await ReviewImage.findByPk(reviewImageId);
    await reviewImage.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
})
module.exports = router;
