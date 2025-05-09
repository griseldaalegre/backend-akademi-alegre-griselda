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

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422)); 
  }

  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new HttpError("Ya existe un usuario con ese email.", 422));
  }

  try {
    const user = new User(req.body);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: userObj,
    });
  } catch (e) {
    next(new HttpError("No se pudo crear el usuario", 400));
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422)); 
  }
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

    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (e) {
    console.error(e);
    next(new HttpError("Credenciales inválidas", 401));
  }
};

const updateUser = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "email", "password", "rol", "activo"];
  const isValidUpdate = updates.every((key) => allowed.includes(key));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  if (!isValidUpdate) {
    return next(
      new HttpError("Actualización inválida: campos no permitidos", 400)
    );
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    updates.forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;

    res.status(200).json({
      message: "Usuario editado correctamente",
      user: userObj,
    });
  } catch (e) {
    if (e.code === 11000 && e.keyPattern?.email) {
      return next(new HttpError("Ya existe un usuario con ese email.", 400));
    }
    next(new HttpError("No se pudo actualizar el usuario", 400));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new HttpError("Usuario no encontrado", 404));
    }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      user: userObj,
    });
  } catch (e) {
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
      ...result,
    });
  } catch (e) {
    console.error("Error al obtener usuarios:", e);
    next(new HttpError("No se pudieron obtener los usuarios", 500));
  }
};

const recoverPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new HttpError("No se encontró un usuario con ese email", 404));

  const recoveryToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const recoveryLink = `http://localhost:3000/password-recovery/${recoveryToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p><a href="${recoveryLink}">${recoveryLink}</a>`,
  });

  res.status(200).json({ message: "Correo de recuperación enviado." });
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); 

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
