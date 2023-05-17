const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateLogin, isUniqueEmail, isUniqueName } = require('../../utils/validation');

const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

//Signup A User

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, firstName, lastName, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, firstName, lastName, username, hashedPassword });

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
        user: safeUser
      });
    }
  );


  // Get current user
  router.get('/users/:userId', requireAuth, async(req, res, next) => {
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
