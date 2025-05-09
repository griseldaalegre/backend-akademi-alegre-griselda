const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const HttpError = require("../util/http-error.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
   
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    return next(new HttpError("No autorizado", 401));
  }
};

module.exports = auth;
