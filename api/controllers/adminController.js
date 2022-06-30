const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const StoreOwner = require('../models/StroreOwner');
const error_400_bad_request = require('../Error_400');

const addStoreOwner = async(req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users[0].isAdmin === false){
            return error_400_bad_request(res,"only admin can!");
        }else{
            const Users_two = await User.find({name:req.body.name}).exec();
            if(Users_two.length>0){
                return error_400_bad_request(res,'user with this name already exist!');
            }
            const storeOwner =new StoreOwner({
                _id: new mongoose.Types.ObjectId(),
                mobile_number: req.body.mobile_number,
            });
            const hash_pass = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password:hash_pass,
                name : req.body.name,
                isStoreOwner:true,
                storeOwnerHolder:storeOwner._id
            });
            
            await user.save();
            await storeOwner.save();
            return res.status(200).json({
                message:"storeOwner succesfully added!"
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};


module.exports= {addStoreOwner};