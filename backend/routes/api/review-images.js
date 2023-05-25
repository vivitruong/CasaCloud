const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { ReviewImage, Review} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking, isReviewer } = require('../../utils/validation');
const e = require('express');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();

//middle waere function to find if review belong to current user
const isReviewImage = async (req, res, next) => {
    const userId = req.user.id;
    const reviewImgId = req.params.imageId;
    const review = await ReviewImage.findByPk(reviewImgId, {
        attributes: ['reviewId']
    });
    if(!review) {
        res.status(404).json({message:"Review Image couldn't be found"})
    } else {
        const reviewId = reviewImgId.reviewId;
        const reviewImage = await Review.findByPk(reviewId);
        const userReview = reviewImage.reviewId
    }
}
//delete an image for a Listing
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const reviewImageId = req.params.imageId;
    const reviewImage = await ReviewImage.findByPk(reviewImageId);
    await reviewImage.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
})
module.exports = router;
