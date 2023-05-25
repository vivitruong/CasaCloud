const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { SpotImage} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking, isOwner } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth, isOwner, async (req, res, next) => {
    const spotId = req.params.imageId;
    const spotImg = await SpotImage.findByPk(spotId);
    await spotImg.destroy();
    res.json({message: "Successfully deleted" })
})


module.exports = router;
