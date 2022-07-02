const { isValidPassword } = require('mongoose-custom-validators');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {
        type : String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique:true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String,
         required: true,
         min: [6, 'Too few'],
         validate: {
            validator: (str) => isValidPassword(str, { nonalpha: false,minlength:8 }),
            message: 'Password must have at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
          } },
    isAdmin:{
        type:Boolean,
        default:false
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    lastSeens:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    hold_for_last:{type:Number,default:0},
    storeOwnerHolder :{ type: mongoose.Schema.Types.ObjectId, ref: 'StoreOwner' },
    isStoreOwner:{type:Boolean,default:false},
    
},{timestamps:true});

module.exports = mongoose.model('User', UserSchema);