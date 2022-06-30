const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const error_400_bad_request = require('../Error_400');

const userAddToFavorite = async (req,res)=>{
    try{
        const product = await Product.find({_id:req.body._id,name:req.body.productName,pathCategory:req.body.pathCategory}).exec();
        if(product.length<1){
            return error_400_bad_request(res,'this product doesnot exist anymore!');
        }else{
            const user = await User.find({name:req.body.username}).exec();
            if(user.length<1){
                return error_400_bad_request(res,'user doesnot exist!');
            }else{
                user[0].favorites = user[0].favorites.concat(product[0]._id);
                await user[0].save();
                return res.status(200).json({
                    message:'product added to your wanna user succesfully!'
                });
            }

        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};
 


module.exports= {userAddToFavorite};