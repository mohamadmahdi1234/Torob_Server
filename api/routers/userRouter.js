const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {userAddToFavorite,getUserFavorits,deleteFavorit} = require('../controllers/userController');

router.post('/addproducttofavorite',Aoutorization,userAddToFavorite);
router.get('/getfavorits',Aoutorization,getUserFavorits);
router.delete('/deleteFavorite',Aoutorization,deleteFavorit);

module.exports = router;