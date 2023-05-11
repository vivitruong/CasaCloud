const express = require('express');
const { Op } = require('sequelize');
const {check} = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {User, Listing} = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

//Get all Listing
router.get('/' , requireAuth,  async (req, res) => {
    try {
        const listings = await Listing.find();
        res.status(200).json({ Listing: listings});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//Get all Listings by the Current User

 router.get('/currentuser', requireAuth, async(req, res, next) => {
    const currListOwner = await Listing.findAll({
        where: { hostId: req.user.id }
    });
    res.status(200).json({ Listing: currListOwner})
 });




module.exports = router;
