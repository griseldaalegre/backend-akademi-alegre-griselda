const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");
const doctorController = require("../controllers/doctor-controller.js");
const doctorValidator  = require("../validators/doctor-validator");

router.post("/", auth, permit("admin", "reception"),doctorValidator, doctorController.createDoctor);

router.patch("/:id", auth, permit("admin", "reception"), doctorController.updateDoctor);

router.get("/:id", auth, permit("admin", "reception"), doctorController.getDoctor);

 router.get("/", auth, permit("admin", "reception"), doctorController.getDoctors);

module.exports = router;
