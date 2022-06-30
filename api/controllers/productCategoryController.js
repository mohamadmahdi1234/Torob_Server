const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const error_400_bad_request = require('../Error_400');

const getProductsWithCategory = async (req,res)=>{
    try{
        if(req.query.productCategory.split("-")[0]!=='m'){
            return error_400_bad_request(res,'root category wrong!');
        }
        if(req.query.productCategory === 'm' && req.query.productCategory.split("-").length===1 ){
            const all_products = await Product.find({}).exec();
            return res.status(200).json({
                products :all_products,
                message:'all products sent succesfully!'
            });
        }else{
            const our_regex = req.query.productCategory;
            const products = await Product.find({pathCategory:{$regex: `${our_regex}.*`}}).select('name price stores pathCategory -_id').exec();
            return res.status(200).json({
                products :products,
                message:'all products sent succesfully!'
            });

        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

const addproduct = async (req,res)=>{
    try{
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name : req.body.name,
            price:req.body.price,
            pathCategory : req.body.pathCategory
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