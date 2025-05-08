const { body } = require("express-validator");

// Para la creación de usuario
const userValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener al menos 5 caracteres"),
  body("name").not().isEmpty().withMessage("El nombre es requerido"),
  body("rol").isIn(["admin", "reception"]).withMessage("Rol inválido"),
];

// Para login
const loginValidator = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Ingresa un email válido"),
  body("password").not().isEmpty().withMessage("La contraseña es obligatoria"),
];

// Para cambio de contraseña
const passwordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"), 
];

module.exports = {
  userValidator,
  loginValidator,
  passwordValidator,
};
