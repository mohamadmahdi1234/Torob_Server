const express = require("express");
const router = express.Router();
const {userSignup,confirmOTP,userSignin,userSignOut} = require('../controllers/authController');
router.post('/signup',userSignup);
router.post('/verifyOTP',confirmOTP);
router.post('/signin',userSignin);
router.get('/signout',userSignOut);
module.exports = router;