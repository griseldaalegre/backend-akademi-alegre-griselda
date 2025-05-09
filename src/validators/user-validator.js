const { body } = require("express-validator");

const createUserValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("name").not().isEmpty().withMessage("El nombre es requerido"),
  body("rol")
    .isIn(["admin", "reception"])
    .withMessage("Rol inválido, roles vaidos: admin, reception"),
];

const loginValidator = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Ingresa un email válido"),
  body("password").not().isEmpty().withMessage("La contraseña es obligatoria"),
];

const passwordValidator = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

const updateUserValidator = [
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("rol")
    .optional()
    .isIn(["admin", "reception"])
    .withMessage("Rol inválido, roles válidos: admin, reception"),
];

module.exports = {
  createUserValidator,
  loginValidator,
  passwordValidator,
  updateUserValidator,
  passwordValidator
};
