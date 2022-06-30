const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {userAddToFavorite,getUserFavorits} = require('../controllers/userController');

router.post('/addproducttofavorite',Aoutorization,userAddToFavorite);
router.post('/getfavorits',Aoutorization,getUserFavorits);

module.exports = router;