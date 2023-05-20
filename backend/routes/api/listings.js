const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const Sequelize = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking, sequelize} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');
const listing = require('../../db/models/listing');
const image = require('../../db/models/image');
// const createStatsCollector = require('mocha/lib/stats-collector');


const router = express.Router();

// Add an Image to a list base on the list's id
router.post('/:id/addImage', requireAuth, async (req, res, next) => {

    let listId = req.params.id;
    let {user}= req;
    const {url , preview} = req.body

    const list = await Listing.findByPk(listId);
    if(!list){
        res.status(404).json({message: "Listing coulnd't be found"})
    }

    const img = await Image.create({
        userId: user.id,
        imageableId: listId,
        imagebleType: "Listing",
        url: url,
        preview: preview
    })
     const imgObj = await Image.findOne({
        where: { reviewImage: url},
        attributes: ['imageableId', 'imageableType', 'reviewImage']
     })
    res.status(200).json(imgObj)
})

//Get all Listings owned by the Current User (done)
 router.get('/currentuser', requireAuth, async(req, res, next) => {
  const id = req.user.dataValues.id;

  const currUser = await Listing.findAll({
      attributes: { include: [[Sequelize.fn("AVG", Sequelize.col("Reviews.rating")), "avgRating"]] },
      include: [{ model: Review, as: 'Reviews', attributes: [] }],
      group: ['Listing.id'],
      where: { hostId: id },
      raw: true
  })
  for (let spot of currUser) {
      const img = await Image.findOne({
          attributes: ['url'],
          where: {
              previewImage: true,
              imageableId: spot.id
          },
          raw: true
      })

      img ? spot.previewImage = img.url : null
  }

  res.json(currUser)
 });

 //Create a Listing (done)
 router.post('/',handleListValidations, requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price} =
    req.body;
     console.log(req.body)

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
  router.put('/:id', requireAuth, handleListValidations, async (req, res, next) => {
    const listId = +req.params.id;
    if (isNaN(listId)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }
    console.log(listId)

    const list = await Listing.findByPk(listId);

    if (!list) {
      return res.status(404).json({ message: "Listing couldn't be found" });
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    list.address = address;
    list.city = city;
    list.state = state;
    list.country = country;
    list.lat = lat;
    list.lng = lng;
    list.name = name;
    list.description = description;
    list.price = price;

    try {
      await list.save();
      return res.status(200).json(list);
    } catch (error) {
      return next(error);
    }
  });


  //Delete a listing
  router.delete('/:id', requireAuth, async (req, res, next) => {
    let listId = +req.params.id;
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
  });

  //Get all review by a Listing id
  router.get('/:id/reviews' , async (req, res, next) => {

  })


//Get details Listing from an id
  router.get('/:id', requireAuth, async (req, res, next) => {
    const listId = +req.params.id;





  })

//Get all Listing(done)
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
