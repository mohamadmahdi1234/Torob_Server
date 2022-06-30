const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {editProfile,getProfile} = require('../controllers/storeOwnerController');

router.post('/profileEdit',Aoutorization,editProfile);
router.get('/profileget',Aoutorization,getProfile);

module.exports = router;