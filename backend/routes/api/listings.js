const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing} = require('../../db/models');
const { handleValidationErrors, handleBodyValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
const createStatsCollector = require('mocha/lib/stats-collector');


const router = express.Router();

//Get all Listing
router.get('/' , requireAuth,  async (req, res) => {
    try {
        const listings = await Listing.find();
        res.status(200).json({ Listing: listings});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//Get all Listings by the Current User
 router.get('/currentuser', requireAuth, async(req, res, next) => {
    const currListOwner = await Listing.findAll({
        where: { hostId: req.user.id }
    });

    res.status(200).json({ Listing: currListOwner})
 });

 //Create a Listing
 router.post('/', requireAuth, handleBodyValidations, async(req, res, next) => {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const list = await Listing.findAll({where: {name: name}});

    if(list.length > 0){
        const err = new Error('Validation Error');
        err.status = 400
        err.errors = [
            "Name must be unique"
        ];
        return next(err);
    }

    if(lat.toString() === lat){
        const err = new Error('Validation Error');
        err.status = 400;
        err.errors = [
            "Latitude is invalid"
        ];
        return next(err);
    }

    if(lng.toString() === lng) {
        const err = new Error('Validation Error');
        err.status = 400;
        err.errors = [
            "longitude is invalid"
        ];
        return next(err);
    }
        const newList = await Listing.create({
        hostId: hostId,
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price
        });
            res.status(201);
            res.json(newList);

});



module.exports = router;
