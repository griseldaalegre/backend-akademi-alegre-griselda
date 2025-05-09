const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const appointmentController = require("../controllers/appointment-controller");
const { createAppointmentValidator, updateAppointmentValidator } = require("../validators/appointment-validator");

router.post("/", auth, permit("admin", "reception"),createAppointmentValidator, appointmentController.createAppointment);

router.get("/:id", auth, permit("admin", "reception"), appointmentController.getAppointment);

router.patch("/:id", auth, permit("admin", "reception"), updateAppointmentValidator, appointmentController.updateAppointment);

 router.get("/", auth, permit("admin", "reception"), appointmentController.getAppointments);

module.exports = router;

