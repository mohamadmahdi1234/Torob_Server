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
            const user = await User.find({name:req.userData.name}).exec();
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
 
const getUserFavorits = async (req,res)=>{
    try{
        const user = await User.find({name:req.userData.name}).exec();
        if(user.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            const for_send =await User.
            findOne({ name: req.body.name }).
            populate('favorites').select('name favorits _id');
            return res.status(200).json({
                favorits  :for_send,
                message:"user's favorit products successfully sent!"
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};

const deleteFavorit = async (req,res)=>{
    try{
        console.log(req.userData.name);
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            const fav = await Product.find({_id:req.body._id}).exec();
            if(fav.length<1){
                return error_400_bad_request(res,'product doesnot exist!');
            }

            const index = users[0].favorites.indexOf(req.body._id);
            if (index > -1) {
                users[0].favorites.splice(index, 1); // 2nd parameter means remove one item only
            }else{
                return error_400_bad_request(res,'user doesnot have this product in his/her favorits!');
            }
            await users[0].save();
            return res.status(200).json({
                message:"daleted succesfuly!"
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

module.exports= {userAddToFavorite,getUserFavorits,deleteFavorit};