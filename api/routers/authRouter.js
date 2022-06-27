const express = require("express");
const router = express.Router();
const {user_signup,user_login} = require('../controllers/auth_stuff/auth_stuff_controllers');
router.post('/signup',user_signup);
router.post('/login',user_login);
module.exports = router;