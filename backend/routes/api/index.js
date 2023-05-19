// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const listingRouter = require('./listings.js');
const reviewRouter = require('./reviews.js');
const bookingRouter = require('./bookings.js')
const imageRouter = require('./images.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/listings', listingRouter)
router.use('/users', usersRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);
router.use('/images', imageRouter);



router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
