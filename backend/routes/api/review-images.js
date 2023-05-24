const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();


//delete an image for a Listing
router.delete('/:imageId', requireAuth, restoreUser, async(req, res, next) => {
    const reviewImageId = req.params.imageId;
    const reviewImage = await Image.findByPk(reviewImageId);
    await reviewImage.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
})
module.exports = router;
