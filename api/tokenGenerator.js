const jwt = require("jsonwebtoken");
require('dotenv').config();
 const generator = (user_email,user_id)=>{
    return jwt.sign(
        {
          email: user_email,
          userId: user_id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "30m"
        }
      );

 }

 module.exports = {generator};