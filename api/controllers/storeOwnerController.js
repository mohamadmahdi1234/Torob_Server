const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const StoreOwner = require('../models/StroreOwner');
const error_400_bad_request = require('../Error_400');
const tokenGenerator = require('../tokenGenerator');
const Store = require('../models/Store');
const Report = require("../models/Report");

const editProfile = async (req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            let token = '';
            if(users[0].isStoreOwner === true){
                let storeOwner =[];
                if(req.body.name !== undefined){
                    const check_dup = await User.find({name:req.body.name}).exec();
                    if(check_dup>0){
                        return error_400_bad_request(res,'cannot update your name!this name already exist!');
                    }else{
                        users[0].name=req.body.name;
                        token = tokenGenerator.generator(users[0].name,users[0]._id); 
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
                    message:"edit succesfully!",
                    token: token
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

const addProduct = async(req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }
        if(users[0].isStoreOwner === false){
            return error_400_bad_request(res,'regular user cannot acces to addproduct');
        }
        const storeOwner = await StoreOwner.find({_id:users[0].storeOwnerHolder}).exec();
        if(storeOwner.length<1){
            return error_400_bad_request(res,'maybe there was problem in add by admin ');
        }
        const check_path = await Category.find({path:req.body.pathCategory}).exec();
        if(check_path.length<1){
            return error_400_bad_request(res,'your wanna category doesnot exist!');
        }
        if(check_path[0].subQueries.length>0){
            return error_400_bad_request(res,'your category path is not leaf!');
        }
        else{

            let flag = false;
            let our_store = [];
            await Promise.all(
                storeOwner[0].stores.map(async st_id=>{
                    const st = await Store.find({_id:st_id}).exec();
                    if(st.length>0){
                        if(st[0].name === req.body.storeName){
                            flag = true;
                            our_store = st;
                        }
                    }
                })
            );
            if(flag === false){
                return error_400_bad_request(res,'store with this name doesnot exist!');
            }
            
            const is_there_in_site = await Product.find({name:req.body.productName,pathCategory:req.body.pathCategory}).exec();
            if(is_there_in_site.length>0){//kala dar kol site hast
                let is_in_store = false;
                let pr = [];
                await Promise.all(
                    our_store[0].products.map(async pd_id=>{
                        const pd = await Product.find({_id:pd_id}).exec();
                        if(pd.length>0){
                            if(pd[0].name === req.body.productName&&pd[0].pathCategory === req.body.pathCategory){
                                is_in_store = true;
                                pr = pd;
                            }
                        }
                    })
                );
                if(is_in_store === true){//dar store mojud ast
                    if(pr[0].price === req.body.productPrice){
                        return error_400_bad_request(res,'this product already is in your store!');
                    }else{
                        return error_400_bad_request(res,'if you want update price of your product do it another place!');
                    }
                }else{
                    const pd_to_add = new Product({
                        _id: new mongoose.Types.ObjectId(),
                        name:is_there_in_site[0].name,
                        price:req.body.productPrice,
                        pathCategory:req.body.pathCategory,
                        fields:is_there_in_site[0].fields,
                        stores : [our_store[0]._id],
                        link:req.body.link
                    });
                    await pd_to_add.save();
                    our_store[0].products = our_store[0].products.concat(pd_to_add._id);
                    await our_store[0].save();
                    
                }

            }else{
                const pd_to_add = new Product({
                    _id: new mongoose.Types.ObjectId(),
                    name:req.body.productName,
                    price:req.body.productPrice,
                    pathCategory:req.body.pathCategory,
                    fields:req.body.productFields,//+check_path[0].fields
                    stores : [our_store[0]._id],
                    first:true,
                    link:req.body.link
                });
                await pd_to_add.save();
                our_store[0].products = our_store[0].products.concat(pd_to_add._id);
                await our_store[0].save();
            }
            return res.status(200).json({
                message:"process of add was succesful!"
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};

const addStore = async(req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            if(users[0].isStoreOwner === false){
                return error_400_bad_request(res,'regular user cannot acces to addStore');
            }else{
                const check_name = await Store.find({name:req.body.name}).exec();
                if(check_name.length>0){
                    return error_400_bad_request(res,'shop with this name already exist!');
                }
                const store = new Store({
                    _id: new mongoose.Types.ObjectId(),
                    name : req.body.name
                });

                await store.save();
                const st_ow = await StoreOwner.find({_id:users[0].storeOwnerHolder}).exec();
                if(st_ow.length<1){
                    return error_400_bad_request(res,'maybe there was problem in add by admin ');
                }
                st_ow[0].stores = st_ow[0].stores.concat(store._id);
                st_ow[0].save();
                return res.status(200).json({
                    message:"store successfuly added!"
                });
            }
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

const seeReports = async(req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            if(users[0].isStoreOwner === true){
                const storeOwner = await StoreOwner.find({_id:users[0].storeOwnerHolder}).exec();
                let flag = false;
                let our_store = [];
                await Promise.all(
                    storeOwner[0].stores.map(async st_id=>{
                        const st = await Store.find({_id:st_id}).exec();
                        if(st.length>0){
                            if(st[0].name === req.query.storeName){
                                flag = true;
                                our_store = st;
                            }
                        }
                    })
                );
                if(flag === false){
                    return error_400_bad_request(res,'store with this name doesnot exist!');
                }else{
                    const repoes = await Report.find({StoreId:our_store[0]._id}).exec();
                    if(repoes.length<1){
                        return res.status(200).json({
                            message:'there is not any report!'
                        });
                    }
                    const for_send = await Promise.all(
                        repoes.map(async rp=>{
                            const prd = await Product.find({_id:rp.productId}).exec();
                            return{
                                description:rp.description,
                                productName:prd[0].name,
                                productCategorypath : prd[0].pathCategory,
                                productPrice:prd[0].price,
                                producttField:prd[0].fields,
                                productId : prd[0]._id
                            }
                        })
                    );
                    return res.status(200).json({
                        storeName:our_store[0].name,
                        reports:for_send,
                        message:"succesful"
                    });
                }

            }else{
                return error_400_bad_request(res,'only storeOwners can access!');
            }
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
}

const getfields = async(req,res)=>{
    try{
        
        if(req.query.pc==="null"){
            console.log("kam");
            return error_400_bad_request(res,'pls enter pathcategory first');
        }
        const categories = await Category.find({path:req.query.pc}).exec();
        if(categories.length<1){
            return error_400_bad_request(res,'this path doesnot exist!');
        }else{
            return res.status(200).json({
                message:'success',
                fields:categories[0].fields
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
}

module.exports= {editProfile,getProfile,addProduct,addStore,seeReports,getfields};