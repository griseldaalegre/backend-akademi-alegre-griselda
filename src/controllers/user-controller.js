const { validationResult } = require("express-validator");
require("dotenv").config({ path: "config/dev.env" });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const HttpError = require("../util/http-error");
const paginate = require("../util/pagination");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// creo usuario
const createUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Datos inválidos en el formulario.", 422));
  }

  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new HttpError("Ya existe un usuario con ese email.", 422));
  }

  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    console.error(e);
    next(new HttpError("No se pudo crear el usuario", 400));
  }
};


// login
const login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = jwt.sign(
      { _id: user._id, role: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // guardo el token en el usuario
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (e) {
    console.error(e);
    next(new HttpError("Credenciales inválidas", 401));
  }
};

// edito usuario
const updateUser = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "email", "password", "rol", "activo"];
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    updates.forEach((u) => (user[u] = req.body[u]));
    await user.save();

    res.send(user);
  } catch (e) {
    console.error(e);
    next(new HttpError("No se pudo actualizar el usuario", 400));
  }
};

// elimino usuario
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    res.send({
      message: "Usuario eliminado exitosamente",
      userEliminado: user,
    });
  } catch (e) {
    console.error(e);
    next(new HttpError("Error al eliminar el usuario", 500));
  }
};

const getUsers = async (req, res, next) => {
  const { page, limit } = req.query;

  try {
    const result = await paginate(User, {}, page, limit, "-password -tokens");

    if (result.data.length === 0) {
      return next(new HttpError("No hay usuarios registrados", 404));
    }

    res.status(200).json({
      message: "Listado de usuarios",
      ...result
    });
  } catch (e) {
    console.error("Error al obtener usuarios:", e);
    next(new HttpError("No se pudieron obtener los usuarios", 500));
  }
};


// recupero contraseña
const recoverPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.email) {
      return next(new HttpError("Usuario no encontrado o sin email", 404));
    }

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

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
    next(new HttpError("Error al enviar email", 500));
  }
};

// reseteo contraseña
const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    user.password = password;
    await user.save();

    res.send({ message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    console.error(err);
    next(new HttpError("Token inválido o expirado", 400));
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
