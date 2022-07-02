const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {addCategory,getCategory,getSubqueriesOfCategory} = require('../controllers/categoryController');

router.post('/addCategory',Aoutorization,addCategory);
router.get('/getCategory',Aoutorization,getCategory);
router.get('/getSubQueries',getSubqueriesOfCategory);

module.exports = router;