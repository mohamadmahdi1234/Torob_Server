const express = require("express");
const router = express.Router();
const Aoutorization = require('../Authorization');
const {getProductsWithCategory,addproduct,filterCategoryProducts} = require('../controllers/productCategoryController');

router.post('/addproduct',addproduct);
router.get('/getProducts',getProductsWithCategory);
router.get('/filter',filterCategoryProducts);

module.exports = router;