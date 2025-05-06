const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const patientController = require("../controllers/patient-controller");

//creo nuevo paciente
router.post("/patient", auth, permit("admin", "reception"), patientController.createPatient);

// actualizo paciente
router.patch("/patient/:id", auth, permit("admin", "reception"), patientController.updatePatient);

// elimino
router.delete("/patient/:id", auth, permit("admin", "reception"), patientController.deletePatient);

// ver detalles de un paciente
router.get("/patient", auth, permit("admin", "reception"), patientController.getPatient);

module.exports = router;
