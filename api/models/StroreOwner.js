const mongoose = require('mongoose');

const StoreOwnerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mobile_number:{type:String,required:true},
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }]
},{timestamps:true});

module.exports = mongoose.model('StoreOwner', StoreOwnerSchema);