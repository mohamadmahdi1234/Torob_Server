const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {userAddToFavorite} = require('../controllers/userController');

router.post('/addproducttofavorite',Aoutorization,userAddToFavorite);


module.exports = router;