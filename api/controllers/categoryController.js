const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const error_400_bad_request = require('../Error_400');

const addCategory = async (req,res)=>{
    try{
        
        const users = await User.find({name:req.userData.name}).exec();
        if(users[0].isAdmin === false){
            return error_400_bad_request(res,"only admin can!");
        }else{
            if(req.query.fields.split("-").length<4){
                return error_400_bad_request(res,"number of fields cannot be less than 4");
            }
            const path_category_tree = req.query.path;
            const name_of_category = req.query.name;
            const search_for = path_category_tree+"-"+name_of_category;
            if(path_category_tree !== 'm'){
                const che = await Category.find({path:path_category_tree}).exec();
            if(che<1){
                return error_400_bad_request(res,"your path category doesnot exist!");
            }
            }
            
            const categories = await Category.find({path:search_for}).exec();
            if(categories.length<1){
                const for_check = req.query.path.split("-").length;
                if(for_check>2){
                    const pedar = await Category.find({path:req.query.path}).exec();
                    if(pedar[0].subQueries.length===0){
                        const help = "m-"+req.query.path.split("-")[1];
                        const nahayee = await Category.find({path:help}).exec();
                        nahayee[0].heigh = nahayee[0].heigh+1;
                        await nahayee[0].save();
                    }
                }
                const cat = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    name:name_of_category,
                    path:search_for,
                    parent : path_category_tree,
                    fields:req.query.fields
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

const getCategory = async(req,res)=>{
    try{
        const parents = await Category.find({parent:'m'}).exec();
        return res.status(200).json({
            mainCategories : parents,
            message : "All categories sent succesfully!" ,
          });

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};
const getSubqueriesOfCategory = async (req,res)=>{
    try{
        const for_check = await Category.find({parent:'m'}).exec();
        if(for_check.length<1){
            return error_400_bad_request(res,'we dont main category!');
        }
       const for_send = await Promise.all(
            for_check.map(async ca =>{
                let c = {
                    path:"subQueries",
                };
                let i=0;
                while(i<ca.heigh){
                    let d={
                    path:"subQueries",
                    populate:c
                    }
                    c=d;
                    i++;
                }
                const for_return = await Category.
                findOne({ name: ca.name }).
                populate({
                  path: 'subQueries',
                  populate: c
                });
                return for_return;
            })
        );
        
        return res.status(200).json({
            subCategories  :for_send,
            message:"all subcategories successfully sent!"
        });

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};

  

module.exports= {addCategory,getCategory,getSubqueriesOfCategory};