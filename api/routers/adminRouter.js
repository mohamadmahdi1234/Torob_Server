const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {addStoreOwner} = require('../controllers/adminController');

router.post('/addStoreOwner',Aoutorization,addStoreOwner);


module.exports = router;