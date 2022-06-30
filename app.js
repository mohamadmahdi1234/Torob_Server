const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const otp =require('./api/models/OTP');
require('dotenv').config();
const authRouter = require('./api/routers/authRouter');
const categoryRouter = require('./api/routers/categoryRouter');
const categoryProductRouter = require('./api/routers/productCategoryRouter');
const userRouter = require('./api/routers/userRouter');
const mongoString = `mongodb+srv://mahdy313:${process.env.ATLAS_PASS}@cluster0.ljbe7.mongodb.net/TorobDataBase?retryWrites=true&w=majority`;

mongoose.connect(mongoString, {useNewUrlParser: true})

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})
/*mongoose.connect('mongodb://localhost/Torob_DataBase')
mongoose.connect('mongodb://localhost/Torob_DataBase')
  .then(() => {
    console.log('connected to database')
  })
  .catch(err => console.log(err))*/

//middlewares
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());


//this part is from youtube maximilian
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-with,Content-Type,Accept,Authorization');
    if(req.method ==='OPTIONS' ){
        res.header('Acces-Control-Allow-Methods'
        ,'PUT,GET,POST,PATCH');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/auth',authRouter);
app.use('/api/category',categoryRouter);
app.use('/api/categoryProduct',categoryProductRouter);
app.use('/api/user',userRouter);

app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
});


app.use((error,req,res,next)=>{
    if(err===null){
        res.status(500).json(
            {
                
                    message : error.message
                
            }
        )
    }
    res.status(error.status).json(
        {
            
                message : error.message
            
        }
    )
});


module.exports = app;