const mongoose = require('mongoose');

const StoreSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {
        type:String,
        required :true
    },
    products:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    address :{type:String},
    link:{type:String,required:true}
        
},{timestamps:true});

module.exports = mongoose.model('Store', StoreSchema);