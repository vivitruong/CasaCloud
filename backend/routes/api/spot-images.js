const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing, Review, Image, Booking} = require('../../db/models');
const { handleValidationErrors, handleListValidations, checkReview_stars, validateBooking } = require('../../utils/validation');

const router = express.Router();

module.exports = router;
