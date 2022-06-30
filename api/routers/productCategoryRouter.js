const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {getProductsWithCategory,addproduct} = require('../controllers/productCategoryController');

router.post('/addproduct',Aoutorization,addproduct);
router.get('/getProducts',getProductsWithCategory);


module.exports = router;