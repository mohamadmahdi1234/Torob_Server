const express = require("express");
const router = express.Router();
const {user_signup,user_login} = require('../controllers/authController');
router.post('/signup',user_signup);
router.post('/login',user_login);
module.exports = router;