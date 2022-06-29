const jwt = require("jsonwebtoken");
require('dotenv').config();
 const generator = (user_name,user_id)=>{
    return jwt.sign(
        {
          name: user_name,
          userId: user_id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "30m"
        }
      );

 }

 module.exports = {generator};