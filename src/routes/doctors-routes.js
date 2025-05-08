const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const doctorController = require("../controllers/doctor-controller.js");
const doctorValidator  = require("../validators/doctor-validator");


//creo nuevo doctor
router.post("/", auth, permit("admin", "reception"),doctorValidator, doctorController.createDoctor);

// actualizo doctor
router.patch("/:id", auth, permit("admin", "reception"), doctorController.updateDoctor);

// elimino
//router.delete("/doctor/:id", auth, permit("admin", "reception"), doctorController.deleteDoctor);

// ver detalles de un doctor
router.get("/:id", auth, permit("admin", "reception"), doctorController.getDoctor);

 // listar doctores con filtros y paginación
 router.get("/", auth, permit("admin", "reception"), doctorController.getDoctors);

module.exports = router;
