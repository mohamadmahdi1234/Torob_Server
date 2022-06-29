const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {addCategory} = require('../controllers/categoryController');

router.post('/addCategory',Aoutorization,addCategory);


module.exports = router;