const { body } = require("express-validator");

const doctorValidator = [
  body("firstName").notEmpty().withMessage("El nombre es requerido"),
  body("lastName").notEmpty().withMessage("El apellido es requerido"),
  body("specialty").notEmpty().withMessage("La especialidad es requerida"),
  body("email").optional().isEmail().withMessage("Email inválido"),
];

module.exports =  doctorValidator ;
