const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {getProductsWithCategory,addproduct,filterCategoryProducts} = require('../controllers/productCategoryController');

router.post('/addproduct',Aoutorization,addproduct);
router.get('/getProducts',Aoutorization,getProductsWithCategory);
router.get('/filter',Aoutorization,filterCategoryProducts);

module.exports = router;