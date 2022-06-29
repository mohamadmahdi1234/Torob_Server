const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const otp =require('./api/models/OTP');
const authRouter = require('./api/routers/authRouter');
const categoryRouter = require('./api/routers/categoryRouter');
mongoose.connect('mongodb://localhost/Torob_DataBase')
  .then(() => {
    console.log('connected to database')
  })
  .catch(err => console.log(err))

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