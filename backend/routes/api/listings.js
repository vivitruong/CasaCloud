const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleBodyValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
const listing = require('../../db/models/listing');
// const createStatsCollector = require('mocha/lib/stats-collector');


const router = express.Router();



//Get all Listings owned by the Current User
 router.get('/currentuser', requireAuth, async(req, res, next) => {
    const currListOwner = await Listing.findAll({
        where: { hostId: req.user.id }
    });

    res.status(200).json({ Listing: currListOwner})
 });

 //Create a Listing
 router.post('/',handleBodyValidations, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
    // console.log({ address, city, state, country, lat, lng, name, description, price})
    const newList = await Listing.create({
      hostId: req.user.id,
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,

    });
    res.status(201);
    res.json(newList);
  });

  //Edit a listing
  router.put('/:listingId', requireAuth, handleBodyValidations, async (req, res, next) => {
    let listId = req.params.listingId;
    let userId = req.params.id

    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const list = await Listing.findByPk(listId)
    if(!list) {
         return res.json({
            message: "Listing couldn't be found",
            statusCode: 404
         });
    }
    const updated = await Listing.update({
        address: address,
        city: city,
        state: state,
        country: country,
        lat: lat,
        lng: lng,
        name: name,
        description: description,
        price: price,
      });
      return res.json(updated);
  })

  //Delete a listing
  router.delete('/:listingId', requireAuth, async (req, res, next) => {
    let listId = req.params.id;
    const currentUser = req.user.id;

    let list = await Listing.findByPk(listId);

    if(currentUser !== Listing.hostId){
        const err = new Error("Authorization Error")
        err.statusCode = 403;
        next(err)
    }
    if (!list) {
      return res.json({
        message: "Listing couldn't be found",
        statusCode: 404,
      });
    }

    list.destroy()
     return res.json({ message: "Successfully Deleted", statusCode:200 });
  })

//Get all Listing from an id
  router.get('/:listingId', requireAuth, async (req, res, next) => {
    const listId = req.params.listingId;
    const list = await Listing.findByPk(listId);
    if(!list) {
         return res.status(404).json({message: "Listing couln't be found"})
    }
    res.status(200).json(list)
  }) // not done yet! need to check the other route

//Get all Listing
router.get('/' , requireAuth,  async (req, res) => {
    try {
        const listings = await Listing.findAll();
        res.status(200).json({ Listing: listings});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


module.exports = router;
