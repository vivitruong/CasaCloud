const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateSignup, validateLogin, isUniqueEmail, isUniqueName } = require('../../utils/validation');

const router = express.Router();

//Signup A User

router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      await isUniqueName(req, res, next);
      await isUniqueEmail(req, res, next);
      const user = await User.create({
        email,
        username,
        firstName,
        lastName,
        hashedPassword,
      });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);
      safeUser.token = req.cookies.token;
      return res.json({
        user: safeUser,
      });
    });


  // Get current user (done)
  router.get('/currentuser', requireAuth, async(req, res, next) => {
    if(req.user) {
      const userId = +req.user.id;
      const currentScope = User.scope('current');
      const curr = await currentScope.findByPk(userId);
      const {id, firstName, lastName, email, username} = curr;
      return res.json({
        user: {
          id, firstName, lastName, email, username,
        },
      });
    } else {
      return res.json({
        user: null
      })
    }
  });


   //Get all user
  router.get('/', async (req, res) => {
  let users =  await User.findAll()

  res.status(200)
  res.json({users})

  });







module.exports = router;
