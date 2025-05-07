const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const patientController = require("../controllers/patient-controller");

//creo nuevo paciente
router.post("/", auth, permit("admin", "reception"), patientController.createPatient);

// actualizo paciente
router.patch("/:id", auth, permit("admin", "reception"), patientController.updatePatient);

// elimino
router.delete("/:id", auth, permit("admin", "reception"), patientController.deletePatient);

// ver detalles de un paciente
router.get("/:id", auth, permit("admin", "reception"), patientController.getPatient);

 // listar pacientes con filtros y paginación
 router.get("/", auth, permit("admin", "reception"), patientController.getPatients);

module.exports = router;
