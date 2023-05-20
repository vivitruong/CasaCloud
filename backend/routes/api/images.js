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
    const imagesId =  req.params.id
    console.log(imagesId)

    const userId = req.user.id;

    if(!userId) return res.status(401).json({ "message": "Authentication required", "statusCode": 401 })

    const findImage = await Image.findOne({
        where: {
            id: imagesId
        }
    })
})
module.exports = router;
