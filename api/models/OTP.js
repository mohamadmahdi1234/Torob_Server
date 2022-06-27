const mongoose = require('mongoose');

const OTPSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_email : {type:String,required: true},
    otp:{
        type:String,
        required:true
    },
    createdAt:{type:Date,default:Date.now,index:{expires:300}}
    
},{timestamps:true});

module.exports = mongoose.model('OTP', OTPSchema);