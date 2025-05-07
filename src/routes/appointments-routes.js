const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const appointmentController = require("../controllers/appointment-controller");

//creo nuevo turno
router.post("/", auth, permit("admin", "reception"), appointmentController.createAppointment);

// ver detalles de un turno
router.get("/:id", auth, permit("admin", "reception"), appointmentController.getAppointment);

// actualizo turno
router.patch("/:id", auth, permit("admin", "reception"), appointmentController.updateAppointmentStatus);

module.exports = router;

