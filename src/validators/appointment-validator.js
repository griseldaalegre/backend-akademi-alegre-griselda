const { body } = require("express-validator");

const createAppointmentValidator = [
  body("date")
    .notEmpty()
    .withMessage("La fecha es requerida")
    .isISO8601()
    .withMessage("Formato de fecha inválido"),
  body("time").notEmpty().withMessage("La hora es requerida"),
  body("patient").notEmpty().withMessage("El ID del paciente es requerido"),
  body("doctor").notEmpty().withMessage("El ID del doctor es requerido"),
  body("status")
    .optional()
    .isIn(["Confirmado", "Cancelado"])
    .withMessage("Estado inválido (debe ser Confirmado o Cancelado)"),
];

const updateAppointmentValidator = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Formato de fecha inválido"),
  body("time").optional().notEmpty().withMessage("La hora no puede estar vacía"),
  body("patient").optional().notEmpty().withMessage("El ID del paciente no puede estar vacío"),
  body("doctor").optional().notEmpty().withMessage("El ID del doctor no puede estar vacío"),
  body("status")
    .optional()
    .isIn(["Confirmado", "Cancelado"])
    .withMessage("Estado inválido (debe ser Confirmado o Cancelado)"),
];



module.exports =  {createAppointmentValidator, updateAppointmentValidator} ;
