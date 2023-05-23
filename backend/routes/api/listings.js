const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const Sequelize = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReviewRating, validateBooking } = require('../../utils/validation');


// const createStatsCollector = require('mocha/lib/stats-collector');


const router = express.Router();

// Add an Image to a list base on the list's id(done)
router.post('/:id/addImage', requireAuth, async (req, res, next) => {
  let { url, previewImage } = req.body;
  let listId = req.params.id;
  let list = await Listing.findOne({
    where: {
      id: listId,
      hostId: req.user.id
    }
  });
  if (!list) {
    res.status(404);
    return res.json({
      message: "Spot couldnt be found",
    });
  }
  const image = await Image.create({
  imageableId: listId,
  imageableType: 'Listings',
  url,
  previewImage
  });

  let imgObj = {
    id: image.id,
    imageableId: image.listId,
    url: image.url,
    previewImage: true
  };
  res.status(200);
  return res.json(imgObj);
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

  //Edit a listing (done)
  router.put('/:id', requireAuth, handleListValidations, async (req, res, next) => {
    const listId = req.params.id;

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


  //Delete a listing(done)
  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const listingId = req.params.id;
      console.log(listingId)

      const listing = await Listing.findByPk(listingId);

      if (!listing) {
        return res.status(404).json({
          message: 'Listing not found'
        });
      }

      await listing.destroy();

      return res.status(200).json({
        message: 'Successfully deleted'
      });
    } catch (error) {
      return next(error);
    }
  });

  //Get all review by a Listing id (ask because the result i get is [])
  router.get('/:id/reviews' , async (req, res, next) => {
    const listId = req.params.id;
  const list = await Listing.findByPk(listId);

  if (list) {
    const reviews = await Review.findAll({
      where: { listingId: listId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Image,
          scope: 'Review',
          attributes: ['id', 'url']
        }
      ]
    });
    console.log(listId + "-------" + reviews)

    res.json({ Reviews: reviews });
  } else {
    res.status(404).json({
      message: 'Listing could not be found'
    });
  }
  });
  //Create a review for a list base on list Id (have error of booking Id)
  router.post('/:id/reviews', requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const listId = req.params.id;
    const list = await Listing.findByPk(listId);



    if (!list) {
      return res.status(404).json({
        message: "Listing could not be found"
      });
    }

    const oldReview = await Review.findOne({
      where: {
        [Op.and]: [
          { listingId: listId },
          { userId }
        ]
      }
    });
    if(list.hostId === userId) {
      return res.status(403).json({
        message: "Host cannot write review for their own listing"
      })
    }

    if (oldReview) {
      return res.status(403).json({
        message: "User already wrote a review for this listing"
      });
    } else {
      const { review, rating } = req.body;

      if (!review) {
        return res.status(400).json({
          message: "Review text is required"
        });
      }

      try {
        const createdReview = await Review.create({
          userId: userId.id,
          listingId: listId.id,
          review: review,
          rating: rating
        });

        return res.json(createdReview);
      } catch (error) {
        return res.status(500).json({
          message: "An error occurred while creating the review",
          error: error.message
        });
      }
    }
  });




//Get details Listing from an id (Done //3)
router.get('/:id', requireAuth, async (req, res, next) => {
  const listId = req.params.id;

  const list = await Listing.findByPk(listId, {
    include: [
      {
        model: Review,
        as: 'Reviews',
        attributes: []
      },
      {
        model: Image,
        attributes: ['id', 'url', 'previewImage', ]
      },
      {
        model: User,
        as: 'Host',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    attributes: {
      include: [
        [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 2), 'avgStarRating']
      ]
    },
    group: [
      'Listing.id', 'Host.id', 'Images.id'
    ],
  });

  if (list) {
    res.json(list);
  } else {
    res.status(404).json({
      message: "Listing couldn't be found"
    });
  }
});


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
