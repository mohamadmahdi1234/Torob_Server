const mongoose = require('mongoose');

const ReportSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description : {
        type:String,
        required :true
    },
    productId :{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    StoreId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }
        
},{timestamps:true});

module.exports = mongoose.model('Report', ReportSchema);