const express = require("express");
const { Op } = require("sequelize");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const { Booking, Review, Image, Spot, User } = require("../../db/models");

const router = express.Router();
