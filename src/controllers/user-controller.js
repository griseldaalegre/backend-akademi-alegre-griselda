const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    const token = jwt.sign({ _id: user._id, role: user.rol }, "claveSecreta", {
      expiresIn: "30d",
    });

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Credenciales inválidas" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -tokens'); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send({ error: "No se pudieron obtener los usuarios" });
  }
};

module.exports = {
  login,
  getUsers 
};