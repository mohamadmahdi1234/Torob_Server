const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {userAddToFavorite,getUserFavorits,deleteFavorit,saveLastSeens,getLastRecentlySeen,getProductDetail,buyProduct,makeReport} = require('../controllers/userController');

router.post('/addproducttofavorite',Aoutorization,userAddToFavorite);
router.get('/getfavorits',Aoutorization,getUserFavorits);
router.delete('/deleteFavorite',Aoutorization,deleteFavorit);
router.post('/saveLastSeens',Aoutorization,saveLastSeens);
router.get('/getlastRecently',Aoutorization,getLastRecentlySeen);
router.post('/getProduct',Aoutorization,getProductDetail);
router.post('/buyProduct',Aoutorization,buyProduct);
router.post('/report',Aoutorization,makeReport);

module.exports = router;