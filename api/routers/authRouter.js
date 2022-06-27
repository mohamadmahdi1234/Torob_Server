const express = require("express");
const router = express.Router();
const {userSignup,confirmOTP} = require('../controllers/authController');
router.post('/signup',userSignup);
router.post('/verifyOTP',confirmOTP);
module.exports = router;