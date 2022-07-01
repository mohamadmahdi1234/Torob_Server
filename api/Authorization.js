const jwt = require('jsonwebtoken');
const error_400_bad = require('./Error_400');
//this part is from youtube maximilian
const Authorization = (req, res, next) => {
    try {
        console.log(req.headers);
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
        req.userData = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        console.log(error);
        return error_400_bad(res,'pls sign in!');
    }
};

module.exports = Authorization;