const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { SpotImage, Spot} = require('../../db/models');

const router = express.Router();
//middle ware funtion toshow spot must belong to the curr user (done)

const isCurrSpotUser = async function (req, res, next) {
    const userId = req.user.id;
    const spotImageId = req.params.imageId;
    const spotImage = await SpotImage.findByPk(spotImageId, {
        attributes: ['spotId']
    });

    if (!spotImage) {
        res.status(404).json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    } else {
        const spotId = spotImage.spotId;

        const spot = await Spot.findByPk(spotId);
        const ownerId = spot.ownerId;
        if (userId === ownerId) {
            next()
        } else {
            const err = new Error('Unauthorized');
            err.message = 'You are not the owner of this spot';
            err.status = 403;
            next(err);
        }
    }
}

router.delete('/:imageId', requireAuth, isCurrSpotUser, async (req, res, next) => {
    const spotId = req.params.imageId;
    const spotImg = await SpotImage.findByPk(spotId);
    await spotImg.destroy();
    res.json({message: "Successfully deleted" })
})


module.exports = router;
