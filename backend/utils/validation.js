const { validationResult , check } = require('express-validator');
const { User } = require('../db/models');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
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
const checkReview_stars = [
  check('review')
    .not().isEmpty()
    .withMessage("Review text is required"),
  check('stars')
    .not().isEmpty()
    .isNumeric()
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]
const handleBodyValidations = [
  check("address")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Street address is required"),
check("city")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("City is required"),
check("state")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("State is required"),
check("country")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Country is required"),
check("lat")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Latitude is not valid"),
check("lng")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Longitude is not valid"),
check("name")
  .exists({ checkFalsy: true })
  .notEmpty()
  .isLength({ max: 50 })
  .withMessage("Name must be less than 50 characters"),
check("description")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Description is required"),
check("price")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Price per day is required"),
  handleValidationErrors
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

module.exports = {
  handleValidationErrors, isUniqueName, isUniqueEmail, validateLogin, validateSignup, handleBodyValidations, checkReview_stars, validateBooking
};
