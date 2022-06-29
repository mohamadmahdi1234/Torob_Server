const express = require("express");
const router = express.Router();
const {userSignup,confirmOTP,userSignin} = require('../controllers/authController');
router.post('/signup',userSignup);
router.post('/verifyOTP',confirmOTP);
router.post('/signin',userSignin);
module.exports = router;