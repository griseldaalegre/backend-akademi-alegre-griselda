const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config({ path: "config/dev.env" }); // Carga las variables de entorno

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
   
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Por favor autenticar" });
  }
};

module.exports = auth;
