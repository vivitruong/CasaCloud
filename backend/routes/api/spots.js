const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const Sequelize = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { handleValidationErrors,isOwner, handleListValidations, checkReviewRating, validateBooking } = require('../../utils/validation');
const spot = require('../../db/models/spot.js');
const spotimage = require('../../db/models/spotimage.js');

// const createStatsCollector = require('mocha/lib/stats-collector');


const router = express.Router();

// Add an Image to a spot base on the spot's id (done)
router.post('/:spotId/images', requireAuth, isOwner, async (req, res, next) => {
  const spotId = req.params.spotId;
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(spotId);

  if (spot) {
      const image = await SpotImage.create({
          url,
          preview,
          spotId
      });
      const newId = image.id;
      const imageData = await SpotImage.scope('defaultScope').findByPk(newId);
      res.json(imageData)
  } else {
      res.status(404).json({
          "message": "Spot couldn't be found",
          "statusCode": 404
      })
  }
});

//Get all Spot owned by the Current User (done)
 router.get('/current', requireAuth, async(req, res, next) => {
  const id = req.user.dataValues.id;

  const spots = await Spot.findAll({
    where: {
      ownerId: id
    },
    attributes: {
      include: [
        [
          sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars'))), 'avgRating'
        ]
      ]
    },
    include: [
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['Spot.id'],
    raw: true
  });
    for( let spot of spots) {
      const image = await SpotImage.findAll({
        where: {
            [Op.and]: [
                {
                    spotId: spot.id,
                },
                {
                    preview: true
                }
            ]
        },
        raw: true
    });
   spot.previewImage = image.length ? image[0]['url'] : null;
  }
  res.json({ "Spots": spots });

 });

 //Create a Spot (get error of price per)
 router.post('/', handleListValidations, requireAuth, async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    res.status(201).json(spot);
  } catch (error) {
    next(error);
  }
});



  //Edit a Spot (got error iof price per...)
  router.put('/:id', requireAuth, handleListValidations, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    try {
      await spot.save();
      return res.status(200).json(spot);
    } catch (error) {
      return next(error);
    }
  });


  //Delete a Spot(done)
  router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    await spot.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

  //Get all review by a Spot id (done)
  router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
        const reviews = await Review.findAll({
            where: {
                spotId
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['username', 'hashedPassword', 'email', 'createdAt', 'updatedAt']
                    }
                },
                {
                model: ReviewImage,
                attributes: {
                    exclude: ['reviewId', 'createdAt', 'updatedAt']
                }
            },
            ]
        });
        res.json({ "Reviews": reviews });
    } else {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

});
  //Create a review for a spot base on spot ID (done)
  router.post('/:spotId/reviews', requireAuth, checkReviewRating, async (req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    const review = await Review.findOne({
        where: {
            [Op.and]: [
                {
                    spotId
                },
                {
                    userId
                }
            ]
        }
    });
    if (review) {
        return res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    } else {
        const { review, stars } = req.body;
        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        });
        res.json(newReview);
    }
});




//Get details of Spotfrom an id (Done)
router.get('/:spotId', async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId, {
      include: [
          {
              model: Review,
              attributes: []
          }, {
              model: SpotImage,
              attributes: ['id', 'url', 'preview']
          }, {
              model: User,
              as: 'Owner',
              attributes: ['id', 'firstName', 'lastName']
          }
      ],
      attributes: {
          include: [
              [
                  sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars')),2), 'avgStarRating'
              ],
          ]
      },
      group: ['Spot.id', 'SpotImages.id', 'Reviews.id', 'Owner.id'],
  });

  if (spot) {
      res.json(spot);
  } else {
      res.status(404).json({
          "message": "Spot couldn't be found",
          "statusCode": 404
      })
  }
});


//Get all Spot (done)
router.get('/' , requireAuth,  async (req, res) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [
          sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars')),2), 'avgRating'
        ],
      ]
    },
    include: [
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['Spot.id'],
    raw: true
  })
  for (let spot of spots) {
    const image = await SpotImage.findAll({
        where: {
            [Op.and]: [
                {
                    spotId: spot.id,
                },
                {
                    preview: true
                }
            ]
        },
        raw: true
    });
    spot.previewImage = image.length ? image[0]['url'] : null;
}
res.json({
  "Spots": spots
})
});


module.exports = router;
