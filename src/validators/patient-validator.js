const { body } = require("express-validator");

const createPatientValidator = [
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("dni")
    .notEmpty()
    .withMessage("El DNI es requerido")
    .isLength({ min: 8, max: 8 })
    .withMessage("El DNI debe tener exactamente 8 caracteres")
    .matches(/^\d{8}$/)
    .withMessage("El DNI debe contener solo números"),
  body("address").optional().isString(),
];

const updatePatientValidator = [
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("dni").optional().notEmpty().withMessage("El DNI no puede estar vacío"),
  body("healthInsurance").optional().notEmpty().withMessage("La cobertura médica no puede estar vacía"),
];


module.exports = {
  createPatientValidator,
  updatePatientValidator
};
