const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const Sequelize = require("sequelize");
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { handleValidationErrors,isOwner,validateQueryParameters, handleListValidations, checkReviewRating, validateBooking, isProperUser, isNotBelongToCurrSpot } = require('../../utils/validation');
// const spot = require('../../db/models/spot.js');
// const spotimage = require('../../db/models/spotimage.js');

// const createStatsCollector = require('mocha/lib/stats-collector');


const router = express.Router();

  //Get all review by a Spot id (done)
  router.get('/:spotId/reviews', requireAuth, async (req, res, next) => {
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
                },
                raw: true
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
            "message": "Spot couldn't be found"
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
            "message": "User already has a review for this spot"
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

//Create a Booking from A spot base on the spot id (done)

router.post('/:spotId/bookings', requireAuth, isNotBelongToCurrSpot, async (req, res, next) => {
  const userId = req.user.id;
  const spotId = req.params.spotId;

  let bookings = await Booking.findAll({
    where: {
      spotId
    },
  })

  let {startDate, endDate } = req.body;
  let newStartDate = new Date(startDate);
  let newEndDate = new Date(endDate);

  if(newEndDate.getTime() <= newStartDate.getTime()) {
    return res.status(400).json({
      message: "Bad Request",
      error: {
        endDate: "endDate cannot be on or before startDate"
      }
    })
  }
  for(let booking of bookings) {
    let start = new Date(booking.startDate);
    let end = new Date(booking.endDate);
    if(!(newEndDate.getTime() <= start.getTime() || newStartDate.getTime() >= end.getTime())){
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        error: {
          startDate :"Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      })
    }
  }

  const resArray = await Booking.create({
    userId, spotId, startDate, endDate
  })
  res.status(200).json(resArray)

} );



//Get all booking fro a aspot base on spot id (doneneen)
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
      res.status(404).json({message: "Spot couldn't be found"})
  } else {
      const ownerId = spot.ownerId;
      //if you are not owner
      if (userId !== ownerId) {
        let userBooking = await Booking.findAll({
          attributes: ["spotId", 'startDate', 'endDate'],
          where: { spotId: spotId },
          raw: true
        })
        res.json({ Bookings: userBooking })
    }
      // if you are owner
      if (userId === ownerId) {
          const ownerBookings = await Booking.findAll({
              where: {
                  spotId
              },
              raw: true
          });
          for (let booking of ownerBookings) {
              const user = await User.findByPk(booking.userId, {
                  attributes: {
                      exclude: ['username', 'createdAt', 'updatedAt']
                  }
              });
              booking.User = user;
          }
          res.json({
              'Bookings': ownerBookings
          })
      }
  }
});

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
   //convert
   spot.lat = parseFloat(spot.lat);
   spot.lng = parseFloat(spot.lng);
   spot.price = parseFloat(spot.price);
   spot.avgRating = parseFloat(spot.avgRating)

  }
  res.json({ "Spots": spots });

 });


  //Edit a Spot (done)
  router.put('/:spotId', requireAuth, handleListValidations, isOwner, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    if(spot) {
      spot.address = address;
      spot.city = city;
      spot.state = state;
      spot.country = country;
      spot.lat = lat;
      spot.lng = lng;
      spot.name = name;
      spot.description = description;
      spot.price = price

    }

    await spot.save();
    res.json(spot);

  });


  //Delete a Spot(done)
  router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if(!spot) {
      return res.status(404).json({ message: "Spot couldnt be found"})
    }
    await spot.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})


//Get details of Spotfrom an id (Done)
router.get('/:spotId',async (req, res, next) => {
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
                sequelize.fn("COUNT", sequelize.col("Reviews.stars")), "numReviews"
              ],
              [
                sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"
              ]
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
 //Create a Spot (done)
 router.post('/', requireAuth, handleListValidations, async (req, res, next) => {

  const ownerId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const spot = await Spot.create({
    ownerId: ownerId,
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

  res.status(201).json(spot);

});


//Get all Spot (done)
router.get('/' , validateQueryParameters, async (req, res) => {
  let { page, size, maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    if (page > 10) {
        page = 10
    }
    if (size > 20) {
        size = 20
    }
    let pagination = {};
    if (page, size) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);
    minLat = parseFloat(minLat);
    maxLat = parseFloat(maxLat);
    minLng = parseFloat(minLng);
    maxLng = parseFloat(maxLng);

    const spots = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.cast(sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating', "FLOAT")
                ],
            ]
        },
        include: [
            {
                model: Review,
                attributes: []
            },
        ],
        where: {
          ...(minPrice && maxPrice ? { price: { [Op.between]: [minPrice, maxPrice] } } : {}),
          ...(minPrice && !maxPrice ? { price: { [Op.gte]: minPrice } } : {}),
          ...(!minPrice && maxPrice ? { price: { [Op.lte]: maxPrice } } : {}),
          ...(minLat && maxLat ? { lat: { [Op.between]: [minLat, maxLat] } } : {}),
          ...(minLat && !maxLat ? { lat: { [Op.gte]: minLat } } : {}),
          ...(!minLat && maxLat ? { lat: { [Op.lte]: maxLat } } : {}),
          ...(minLng && maxLng ? { lng: { [Op.between]: [minLng, maxLng] } } : {}),
          ...(minLng && !maxLng ? { lng: { [Op.gte]: minLng } } : {}),
          ...(!minLng && maxLng ? { lng: { [Op.lte]: maxLng } } : {}),
          },
        group: ['Spot.id'],
        raw: true,
        ...pagination,
        subQuery: false
    });

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
        if (!image.length) {
            spot.previewImage = null;
        } else {
            spot.previewImage = image[0]['url'];
        }

    }
    if (page && size) {
        res.json({ "Spots": spots, page, size })
    } else {
      spots.lat = parseFloat(spots.lat);
      spots.lng = parseFloat(spots.lng);
      spots.price = parseFloat(spots.price)
      spots.avgRating = parseFloat(spots.avgRating)
        res.json({
            "Spots": spots
        })
      }
//   const spots = await Spot.findAll({
//     attributes: {
//       include: [
//         [
//           sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars')),2), 'avgRating'
//         ],
//       ]
//     },
//     include: [
//       {
//         model: Review,
//         attributes: []
//       }
//     ],
//     group: ['Spot.id'],
//     raw: true
//   })
//   for (let spot of spots) {
//     const image = await SpotImage.findAll({
//         where: {
//             [Op.and]: [
//                 {
//                     spotId: spot.id,
//                 },
//                 {
//                     preview: true
//                 }
//             ]
//         },
//         raw: true
//     });
//     spot.previewImage = image.length ? image[0]['url'] : null;
// }
// res.json({
//   "Spots": spots
// })
});


module.exports = router;
