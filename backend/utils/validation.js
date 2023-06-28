const { validationResult , check } = require('express-validator');
const { User, Spot , Review, Booking} = require('../db/models');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = [];
    validationErrors
      .array()
      .forEach(error => errors.push(error.msg));

    const err = Error("Validation error");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateBooking = [
  check('checkIn')
    .not().isEmpty()
    .isDate()
    .withMessage('checkIn date is required and must be a date'),
  check('checkIn')
    .isAfter(Date.Now)
    .withMessage('checkIn date must be after the current date'),
  check('checkOut')
    .not().isEmpty()
    .isDate()
    .withMessage('checkOut date is required and must be a date'),
    handleValidationErrors
]
const checkReviewRating = [
  check('review')
  .exists({ checkFalsy: true })
  .withMessage('Review text is required'),
check('stars')
  .exists({ checkFalsy: true })
  .isInt({ min: 1, max: 5 })
  .withMessage('Stars must be an integer from 1 to 5'),
handleValidationErrors
]
const handleListValidations = [
  check('address')
  .exists({ checkFalsy: true })
  .withMessage('Street address is required'),
check('city')
  .exists({ checkFalsy: true })
  .withMessage('City is required'),
check('state')
  .exists({ checkFalsy: true })
  .withMessage('State is required'),
check('country')
  .exists({ checkFalsy: true })
  .withMessage('Country is required'),
check('lat')
  // .exists({ checkFalsy: true })
  .isNumeric()
  .withMessage('Latitude is not valid'),
check('lng')
  // .exists({ checkFalsy: true })
  .isNumeric()
  .withMessage('Longitude is not valid'),
check('description')
  .exists({checkFalsy: true})
  .withMessage('Description is required'),
check('price')
  .exists({ checkFalsy: true })
  .isInt({ min: 1 })
  // .isNumeric()
  .withMessage('Price per day is required'),
handleValidationErrors,
]

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("username")
    .not().isEmpty()
    .withMessage("Username is required"),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .not().isEmpty()
    .withMessage("First name is required"),
  check("lastName")
    .not().isEmpty()
    .withMessage("Last name is required"),
  handleValidationErrors,
];

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

const isUniqueName = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.findAll({
    where: {
      username: username
    }
  })


  if(user.length > 0){
     const err = new Error('User already exists');
     err.status = 403;
     err.errors = [
      "User with that username already exists"
     ]
     next(err);
  }
};

 const isUniqueEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    where: {
      email: email
    }
  })

  if(user){
     const err = new Error('User already exists');
     err.status = 403;
     err.errors = [
      "User with that email already exists"
     ]
     next(err);
  }
};
//check if the user is owner of the spot
const isOwner = async function (req, res, next) {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {

      return res.status(404).json({
          "message": "Spot couldn't be found",
          "statusCode": 404
      })
  }
  const ownerId = spot.ownerId;
  const userId = req.user.id;
  if (userId === ownerId) {
      return next();
  } else {
      const err = new Error('Unauthorized');
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
  }
}
//checkif review belongs to the current user
const isReviewer = async function (req, res, next) {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;
  const review = await Review.findByPk(reviewId);
  if (!review) {
      return res.status(404).json({
          "message": "Review couldn't be found",
          "statusCode": 404
      })
  }
  const userReviewId = review.userId;
  if (userId === userReviewId) {
      return next();
  } else {
      const err = new Error('Unauthorized');
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
  }
}
//check if the bookibg is belong to the current user (done)
const isUpdateBooking = async (req, res, next) => {
  const userId = req.user.id;
  const bookingId = req.params.bookingId;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
      res.status(404).json({
          "message": "Booking couldn't be found",
          "statusCode": 404
      });
  } else {
      const userBookingId = booking.userId;
      if (userId === userBookingId) {
          next();
      } else {
          const err = new Error('Unauthorized');
          err.message = 'Booking must belong to the proper user';
          err.status = 403;
          return next(err);
      }
  }
}
//check if the booking is belong to the curr uer or the Spot must belong to the curr user
const isProperUser = async( req, res, next) => {
  const userId = req.user.id;
  const bookingId = req.params.bookingId;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
      res.status(404).json({
          "message": "Booking couldn't be found",
          "statusCode": 404
      });
  } else {
      const spotId = booking.spotId;
      const spot = await Spot.findByPk(spotId);
      const ownerId = spot.ownerId;
      const userBookingId = booking.userId;
      if (userId === userBookingId || userId === ownerId) {
          next()
      } else {
          const err = new Error('Unauthorized');
          err.message = 'Booking must belong the proper user/ This Spot must belong to the proper user';
          err.status = 403;
          return next(err);
      }
  }
}
//check if spot must not belong the current user (to create booking)
const isNotBelongToCurrSpot = async function (req, res, next) {
  const userId = req.user.id;
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
      return res.status(404).json({
          "message": "Spot couldn't be found",
          "statusCode": 404
      })
  }
  const ownerId = spot.ownerId;
  if (userId === ownerId) {
      const err = new Error('Unauthorized');
      err.message = 'You cant book your own place';
      err.status = 403;
      return next(err);
  } else {
      return next();
  }
}
//query filters to get All Spots
const validateQueryParameters = [
  check('page')
  .optional()
  .exists({ checkFalsy: true })
  .isInt({ min: 1 })
  .withMessage('Page must be greater than or equal to 1'),
check('size')
  .optional()
  .exists({ checkFalsy: true })
  .isInt({ min: 1 })
  .withMessage('Size must be greater than or equal to 1'),
check('minLat')
  .optional()
  .exists({ checkFalsy: true })
  .isDecimal()
  .withMessage('Minimum latitude is invalid'),
check('maxLat')
  .optional()
  .exists({ checkFalsy: true })
  .isDecimal()
  .withMessage('Maximum latitude is invalid"'),
check('minLng')
  .optional()
  .exists({ checkFalsy: true })
  .isDecimal()
  .withMessage('Minimum longitude is invalid'),
check('maxLng')
  .optional()
  .exists({ checkFalsy: true })
  .isDecimal()
  .withMessage('Max longitude is invalid'),
check('minPrice')
  .optional()
  .exists({ checkFalsy: true })
  .isFloat({min:0})
  .withMessage('Minimum price must be greater than or equal to 0'),
check('maxPrice')
  .optional()
  .exists({ checkFalsy: true })
  .isFloat({min:0})
  .withMessage('Maximum price must be greater than or equal to 0'),

handleValidationErrors
];


module.exports = {
  handleValidationErrors,validateQueryParameters, isNotBelongToCurrSpot, isProperUser, isReviewer, isOwner, isUpdateBooking, isUniqueName, isUniqueEmail, validateLogin, validateSignup, handleListValidations, checkReviewRating, validateBooking
};
