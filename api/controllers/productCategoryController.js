const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const error_400_bad_request = require('../Error_400');

const getProductsWithCategory = async (req,res)=>{

};

const addproduct = async (req,res)=>{
    try{
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name : req.body.name,
            price:req.body.price
        });
        await product.save();
        return res.status(200).json({
            message:"added"
        });

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};
  

module.exports= {getProductsWithCategory,addproduct};