const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {editProfile,getProfile,addProduct,addStore} = require('../controllers/storeOwnerController');

router.post('/profileEdit',Aoutorization,editProfile);
router.get('/profileget',Aoutorization,getProfile);
router.post('/addProduct',Aoutorization,addProduct);
router.post('/addStore',Aoutorization,addStore);

module.exports = router;