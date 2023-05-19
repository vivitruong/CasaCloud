const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleBodyValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
// const createStatsCollector = require('mocha/lib/stats-collector');

const router = express.Router();
//Delete a review

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const currentUser = req.user.id;
    const deleteReview = await Review.findByPk(req.params.id);

    if (!deleteReview) {
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404,
          });
    }
    if (currentUser !== Listing.hostId) {
      const err = new Error("Authorization Error")
      err.statusCode = 403;
      next(err)
    }
    deleteReview.destroy();
    res.status(200);
    return res.json({
      message: "Successfully deleted",
      statusCode: 200,
    });

})
//Edit a review
router.put('/:reviewId', requireAuth, checkReview_stars, async (req, res, next) => {
    const currentUser = req.user.id;
    const reviewId = req.params.id;

    const {review, rating } = req.body;
    const getReview = await Review.findByPk(reviewId);

    if(!getReview){
        res.status(400);
        res.json({message: "Review couldn't be found"})
    }
     const editReview = await Review.findOne({
        where: {
            id: reviewId
        }
     });
     if(editReview.rating < 1 || editReview.rating > 5 ){
        res.status(400);
        res.json({
            message: "Bad Request",
            errors : {
                review: "Review text is required",
                rating: "Stars must be an integer from 1 to 5"
            }
        })
     }
      editReview.review = review;
      editReview.rating = rating;
      await editReview.save();
      res.status(200).json(editReview);


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
                attributes: ['id', 'reviewImage', 'imageableId', 'imageableType']
            }
        ]
    });
    return res.json( { review});
})

module.exports = router;
