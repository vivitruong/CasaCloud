const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleBodyValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();


//Delete a review
router.delete('/:reviewId', requireAuth, restoreUser, async (req, res, next) => {
    const currentUser = req.user.id;
    console.log(currentUser)
    const reviewId = req.params.id;
    console.log(reviewId)
    const deleteReview = await Review.findByPk(reviewId);

    if (!currentUser) return res.status(401).json({ "message": "You're not logged in"})

    if(deleteReview) {
        await deleteReview.destroy();
        res.json({message: "Successfully deleted"})
    } else {
        res.status(404).json({ message: "Review couldnt be found"})
    }

})
//Edit a review
router.put('/:reviewId', requireAuth, checkReview_stars, async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    const { user } = req
    if (!user) return res.status(401).json({ "message": "You're not logged in", "statusCode": 401 })

    const { review, rating } = req.body;

    let updatedReview = await Review.findByPk(id)
    if (!updatedReview) return res.status(404).json({ "message": "Review couldn't be found", "statusCode": 404 })

    let reviewInfo = await Review.findOne({ where: { id }, raw: true })

    const newReview = await updatedReview.set(
        {
            userId: user.dataValues.id,
            listingId: reviewInfo.spotId,
            review,
            rating
        }
    )
    await newReview.save()
    res.json(newReview)


})
//Get all Reviews of the Current User (done)
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
        ]
    });
    return res.json(review);
})

module.exports = router;
