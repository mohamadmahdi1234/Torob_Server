const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name :{
        type:String,
        required:true,
        unique:false
    },
    price:{
        type:Number,
        default:0,
        required:true
    },
    stores: [{ type: mongoose.Schema.Types.ObjectId}], 
    pathCategory : {type:String,required:true} ,
    fields:{type: Object,required:true},
    first:{type:Boolean,default:false},
    link:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Product', ProductSchema);