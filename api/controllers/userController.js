const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require('../models/Category');
const Product = require('../models/Product');
const error_400_bad_request = require('../Error_400');
const Store = require('../models/Store');
const Report = require('../models/Report');


const userAddToFavorite = async (req,res)=>{
    try{
        const product = await Product.find({_id:req.body._id}).exec();//change dadam motmaen nistam
        if(product.length<1){
            return error_400_bad_request(res,'this product doesnot exist anymore!');
        }else{
            const user = await User.find({name:req.userData.name}).exec();
            if(user.length<1){
                return error_400_bad_request(res,'user doesnot exist!');
            }else{
                const check = user[0].favorites.includes(product[0]._id);
                if(check===true){
                    return error_400_bad_request(res,'you already have this in your favs!');
                }
                user[0].favorites = user[0].favorites.concat(product[0]._id);
                await user[0].save();
                return res.status(200).json({
                    message:'product added to your wanna user succesfully!'
                });
            }

        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};
 
const getUserFavorits = async (req,res)=>{
    try{
        const user = await User.find({name:req.userData.name}).exec();
        if(user.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            const for_send =await User.
            findOne({ name: req.userData.name }).
            populate('favorites');
            return res.status(200).json({
                favorits  :for_send,
                message:"user's favorit products successfully sent!"
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }

};

const deleteFavorit = async (req,res)=>{
    try{
        console.log(req.userData.name);
        const users = await User.find({name:req.userData.name}).exec();
        if(users.length<1){
            return error_400_bad_request(res,'user doesnot exist!');
        }else{
            console.log(req.body);
            const fav = await Product.find({_id:req.body._id}).exec();
            if(fav.length<1){
                return error_400_bad_request(res,'product doesnot exist!');
            }

            const index = users[0].favorites.indexOf(req.body._id);
            if (index > -1) {
                users[0].favorites.splice(index, 1); // 2nd parameter means remove one item only
            }else{
                return error_400_bad_request(res,'user doesnot have this product in his/her favorits!');
            }
            await users[0].save();
            return res.status(200).json({
                message:"daleted succesfuly!"
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

const saveLastSeens = async (req,res)=>{
    try{
        const users = await User.find({name:req.userData.name}).exec();
        const index = users[0].lastSeens.indexOf(req.body._id);
        if(index>-1){
            return res.status(200).json({
                message:"saved successfully!"
            });
        }
        const check = users[0].hold_for_last ===3;
        if(check){
            users[0].lastSeens[0] = req.body._id;
            hold_for_last=1;
        }else{
            users[0].lastSeens[users[0].hold_for_last] = req.body._id;
            users[0].hold_for_last = users[0].hold_for_last+1;
        }
        await users[0].save();
        return res.status(200).json({
            message:"saved successfully!"
        });

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

const getLastRecentlySeen = async(req,res)=>{
    try{
        const users = await User.findOne({ name: req.userData.name }).
        populate('lastSeens').select('-isAdmin -password -email');
        return res.status(200).json({
            lastSeens : users,
            message :"sent succesfully!"
        });


    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};
const getProductDetail = async(req,res)=>{
    try{
        const products = await Product.find({name:req.body.name,pathCategory:req.body.path}).sort({price:1}).exec();
        console.log(products);
        const low_price = products[0].price;
        const max_price = products[products.length-1].price;
        const for_send = await Promise.all(
            products.map(async prd=>{
                const str = await Store.find({_id:prd.stores[0]}).exec();
                return {
                    product_name: prd.name,
                    product_price : prd.price,
                    product_id:prd._id,
                    store : str[0],
                    fields:prd.fields,
                    link:str[0].link!==undefined?str[0].link:'www.google.com'
                }
            })
        );
        console.log(for_send);
        return res.status(200).json({
                lowPrice:low_price,
                maxPrice:max_price,
                products_with_diff_stores:for_send
        });
    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

const buyProduct = async(req,res)=>{
    try{
        const store = await Store.find({name:req.body.name}).exec();
        if(store.length<1){
            return error_400_bad_request(res,'store doesnot find!');
        }else{
            return res.status(200).json({
                link : store[0].address
            });
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

const makeReport = async (req,res)=>{
    try{
        console.log(req.body);
        const store = await Store.find({_id:req.body.store_id}).exec();
        if(store.length<1){
            return error_400_bad_request(res,'store doesnot exist!');
        }else{
            const product = await Product.find({_id:req.body.product_id}).exec();
            if(product.length<1){
                return error_400_bad_request(res,'product doesnot exist!');
            }else{
                const repo = new Report({
                    _id: new mongoose.Types.ObjectId(),
                    productId : store[0]._id,
                    StoreId : product[0]._id,
                    description:req.body.description
                });
                await repo.save();
                return res.status(200).json({
                    message:"report sent!"
                });
            }
        }

    }catch(err){
        console.log(err);
        return error_400_bad_request(res,err.message);
    }
};

module.exports= {userAddToFavorite,getUserFavorits,deleteFavorit,saveLastSeens,getLastRecentlySeen,getProductDetail,buyProduct,makeReport};