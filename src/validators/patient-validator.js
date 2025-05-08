const { body } = require("express-validator");

const patientValidator = [
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("dni").notEmpty().withMessage("El DNI es requerido"),
  body("healthInsurance")
    .notEmpty()
    .withMessage("La cobertura médica es requerida"),
  body("address").optional().isString(),
];

module.exports = patientValidator;
