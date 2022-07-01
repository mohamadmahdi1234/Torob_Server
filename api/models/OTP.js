const mongoose = require('mongoose');
const { isValidPassword } = require('mongoose-custom-validators');

const OTPSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_email : {type:String,required: true,  
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},
    otp:{
        type:String,
        required:true
    },
    createdAt:{type:Date,default:Date.now,index:{expires:300}},
    name : {
        type : String,
        required: true, 
       
    },
    password: { type: String,
        required: true,
        min: [6, 'Too few'],
        validate: {
           validator: (str) => isValidPassword(str, { nonalpha: false,minlength:8 }),
           message: 'Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number.'
         } },
    
},{timestamps:true});

module.exports = mongoose.model('OTP', OTPSchema);