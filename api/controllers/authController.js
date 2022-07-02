const mongoose = require("mongoose");
const User = require('../models/User');
const bcrypt = require("bcrypt");
const error_400_bad_request = require('../Error_400');
const otpGenerator = require('otp-generator');
const OTP = require("../models/OTP");
const nodemailer = require("nodemailer");
const {google} = require('googleapis');
require('dotenv').config();
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(process.env.CLIENT_ID,process.env.CLIENT_PASS);
OAuth2_client.setCredentials({refresh_token:process.env.REFRESH_TOKEN});
const tokenGenerator = require('../tokenGenerator');

const userSignup = async (req,res)=>{
    try{
        const Users = await User.find({name:req.body.name}).exec();
        if(Users.length<1){
            const hash_pass = await bcrypt.hash(req.body.password, 10);
            console.log(hash_pass);
            const otp_value = otpGenerator.generate(6,{
                digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false,
            });
            console.log(otp_value);
            const otp_value_hash = await bcrypt.hash(otp_value, 10); 
            const otp_record = new OTP({
                _id: new mongoose.Types.ObjectId(),
                user_email:req.body.email,
                otp:otp_value_hash,
                email: req.body.email,
                password:req.body.password,
                name : req.body.name,
            });
            await otp_record.save();
            otp_record.password=hash_pass;
            await otp_record.save();
            const access_token = OAuth2_client.getAccessToken();
            const transport = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    type:'OAuth2',
                    user:'mohamadnoori123@gmail.com',
                    clientId:process.env.CLIENT_ID,
                    clientSecret:process.env.CLIENT_PASS,
                    refreshToken:process.env.REFRESH_TOKEN,
                    accessToken:access_token

                },
            });
            
            await transport.sendMail({
                from:`OTP CODE <mohamadnoori123@gmail.com>`,
                to:req.body.email,
                subject:"CONFIRM CODE",
                text:`hello pls input this code before five min ${otp_value}`
            });    
            return res.status(200).json({
                message:"email sent!",
            });
              
        }else{
            return error_400_bad_request(res,'user already exist!');
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};

const confirmOTP = async(req,res)=>{
    try{
        const six_digit = req.body.number;
        const otps = await OTP.find({name:req.body.name}).exec();
        if(otps<1){
            return error_400_bad_request(res,'no shuch user found or code expired!');
        }else{
            const yaft = await User.find({name:req.body.name}).exec();
            if(yaft.length>0){
                return error_400_bad_request(res,'in validation there was problem try again pls from first!')
            }
            const validOtp = await bcrypt.compare(six_digit, otps[0].otp);
            if(validOtp === true){
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: otps[0].user_email,
                    password:otps[0].password ,
                    name : otps[0].name,
                  });
                await user.save();
                await OTP.deleteMany({name:req.body.name});
                const token = tokenGenerator.generator(user.name,user._id); 
                res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
                console.log(token);
                  return res.status(200).json({
                    token: token,
                    isAdmin:false,
                    isStoreOwner:false,
                    "message": "successful"
                  });


            }else{
                return error_400_bad_request(res,'wrong code!');
            }
        }


    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};
const userSignin = async(req,res)=>{
    try{
        const users = await User.find({name:req.body.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,"user with this username doesn't exist");
        }else{
            const validatepass = await bcrypt.compare(req.body.password, users[0].password);
            if(validatepass === true){
                const token = tokenGenerator.generator(users[0].name,users[0]._id); 
                res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
                console.log(token);
                  return res.status(200).json({
                    token: token,
                    isAdmin:users[0].isAdmin,
                    isStoreOwner:users[0].isStoreOwner,
                    "message": "successful"
                  });

            }else{
                return error_400_bad_request(res,"wrong password");
            }
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};
const userSignOut = async (req,res)=>{
    res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
    res.redirect('/');
};

module.exports= {userSignup,confirmOTP,userSignin,userSignOut};