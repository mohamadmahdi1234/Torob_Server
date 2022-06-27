const jwt = require("jsonwebtoken");
 const Generator = (user_email,user_id)=>{
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

 module.exports = {Generator};