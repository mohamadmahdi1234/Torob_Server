const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const error_400_bad_request = require('../Error_400');

const addCategory = async (req,res)=>{
    try{
        console.log(req.query.path+" "+req.query.name);
        const users = await User.find({name:req.userData.name}).exec();
        if(users[0].isAdmin === false){
            return error_400_bad_request(res,"only admin can!");
        }else{
            const path_category_tree = req.query.path;
            const name_of_category = req.query.name;
            const search_for = path_category_tree+"-"+name_of_category;
            const categories = await Category.find({path:search_for}).exec();
            if(categories.length<1){
                const cat = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    name:name_of_category,
                    path:search_for,
                    parent : path_category_tree
                });
                await cat.save();
                const father = await Category.find({path:path_category_tree}).exec();
                if(father.length>0){
                    father[0].subQueries = father[0].subQueries.concat(cat._id);
                    await father[0].save();
                }
                return res.status(200).json({
                    message:"category addded succesfully!"
                });
            }else{
                return error_400_bad_request(res,'this path of category is already exist!')
            }
        }
    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};



module.exports= {addCategory};