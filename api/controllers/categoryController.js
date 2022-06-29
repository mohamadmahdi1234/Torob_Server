const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const error_400_bad_request = require('../Error_400');

const addCategory = async (req,res)=>{
    try{
        console.log(req.query.path+" "+req.query.name);
        

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};



module.exports= {addCategory};