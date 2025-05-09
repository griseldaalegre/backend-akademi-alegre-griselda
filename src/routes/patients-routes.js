const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const patientController = require("../controllers/patient-controller");
const {  createPatientValidator, updatePatientValidator} = require("../validators/patient-validator");

router.post("/", auth, permit("admin", "reception"), createPatientValidator, patientController.createPatient);

router.patch("/:id", auth, permit("admin", "reception"),updatePatientValidator, patientController.updatePatient);

router.delete("/:id", auth, permit("admin", "reception"), patientController.deletePatient);

router.get("/:id", auth, permit("admin", "reception"), patientController.getPatient);

 router.get("/", auth, permit("admin", "reception"), patientController.getPatients);

module.exports = router;
