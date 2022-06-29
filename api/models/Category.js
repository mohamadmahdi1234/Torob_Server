const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {
        type:String,
        required :true
    },
    path:{
        type:String,
        required:true
    }
        
},{timestamps:true});

module.exports = mongoose.model('Category', CategorySchema);