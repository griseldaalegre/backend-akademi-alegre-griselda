const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "config/dev.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// creo usuario
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).send({ user, token });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
};

// login
const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = jwt.sign({ _id: user._id, role: user.rol }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // guardo el token en el usuario
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: "Credenciales inválidas" });
  }
};

// edito usuario
const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "email", "password", "rol", "activo"];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) return res.status(400).send({ error: "Actualización inválida" });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

    updates.forEach((u) => (user[u] = req.body[u]));
    await user.save();
    res.send(user);
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: "No se pudo actualizar el usuario" });
  }
};

// elimino usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

    res.send({ message: "Usuario eliminado exitosamente", userEliminado: user });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error al eliminar el usuario" });
  }
};

// obtengo usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -tokens");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send({ error: "No se pudieron obtener los usuarios" });
  }
};

// recupero contraseña
const recoverPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.email) {
      return res.status(404).send({ error: "Usuario no encontrado o sin email" });
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: "Recuperación de contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.send({ message: "Correo de recuperación enviado" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error al enviar email" });
  }
};

// reseteo contraseña
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

    user.password = password;
    await user.save();

    res.send({ message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: "Token inválido o expirado" });
  }
};

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser,
  getUsers,
  recoverPassword,
  resetPassword,
};
