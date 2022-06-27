const mongoose = require("mongoose");
const Otp = require('../models/OTP');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const error_400_bad_request = require('../Error_400');

const userSignup = async (req,res)=>{
    try{
        const Users = await User.find({name:req.body.name}).exec();
        if(Users.length<1){
            const hash_pass = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash_pass,
                name : req.body.name,
              });


        }else{
            return error_400_bad_request(res,'user already exist!');
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,'bad request!');
    }

};

module.exports= {userSignup};