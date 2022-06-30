const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const StoreOwner = require('../models/StroreOwner');
const error_400_bad_request = require('../Error_400');
const tokenGenerator = require('../tokenGenerator');

const editProfile = async (req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            if(users[0].isStoreOwner === true){
                let storeOwner =[];
                if(req.body.name !== undefined){
                    const check_dup = await User.find({name:req.body.name}).exec();
                    if(check_dup>0){
                        return error_400_bad_request(res,'cannot update your name!this name already exist!');
                    }else{
                        users[0].name=req.body.name;
                        const token = tokenGenerator.generator(users[0].name,users[0]._id); 
                        res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
                    }
                }
                if(req.body.mobile_number !== undefined){
                    storeOwner = await StoreOwner.find({_id:users[0].storeOwnerHolder}).exec();
                    if(storeOwner.length<1){
                        return error_400_bad_request(res,'maybe there was problem in add by admin ');
                    }
                    storeOwner[0].mobile_number = req.body.mobile_number;
                }
                if(req.body.email !== undefined){
                    users[0].email=req.body.email;
                }
                await users[0].save();
                if(storeOwner.length>0){
                    await storeOwner[0].save();
                }
                return res.status(200).json({
                    message:"edit succesfully!"
                });
            }else{
                return error_400_bad_request(res,'user is not storeOwner!');
            }
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};

const getProfile = async (req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            if(users[0].isStoreOwner === false){
                return error_400_bad_request(res,'reqular user cannot acces to profile');
            }
            const mob = await StoreOwner.find({_id:users[0].storeOwnerHolder}).exec();
            return res.status(200).json({
                user_profile:{
                    name:users[0].name,
                    email:users[0].email,
                    mobile_number:mob[0].mobile_number
                }
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};


module.exports= {editProfile,getProfile};