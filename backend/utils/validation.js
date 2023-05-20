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
const handleListValidations = [
  check('address')
    .notEmpty()
    .withMessage('Address is required')
    .withMessage('Address must be at most 100 characters long'),
  check('city')
    .notEmpty()
    .withMessage('City is required')
    .withMessage('City must be at most 100 characters long'),
  check('state')
    .notEmpty()
    .withMessage('State is required')
    .withMessage('State must be at most 50 characters long'),
  check('country')
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isDecimal()
    .withMessage('Latitude must be a decimal number')
    .isFloat({ min: -90.999999, max: 90.999999 })
    .withMessage('Latitude must be between -90.999999 and 90.999999'),
  check('lng')
    .notEmpty()
    .withMessage('Longitude is required')
    .isDecimal()
    .withMessage('Longitude must be a decimal number')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  check('name')
    .notEmpty()
    .withMessage('Name is required'),
  check('description')
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .notEmpty()
    .withMessage('Price is required')
    .isDecimal()
    .withMessage('Price must be a decimal number'),
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
  handleValidationErrors, isUniqueName, isUniqueEmail, validateLogin, validateSignup, handleListValidations, checkReview_stars, validateBooking
};
