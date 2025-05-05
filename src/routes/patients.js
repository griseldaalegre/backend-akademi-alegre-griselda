const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");

//creo nuevo paciente
router.post("/", auth, permit("admin", "recepction"), async (req, res) => {
  const patient = new Patient(req.body);
  try {
    await patient.save();
    res.status(201).send(patient);
  } catch (e) {
    res.status(400).send(e);
  }
});

// actualizo paciente
router.patch("/:id", auth, permit("admin", "recepction"), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = [
    "name",
    "dni",
    "healthInsurance",
    "phone",
    "address",
    "birthDate",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) return res.status(400).send({ error: "Invalid update" });

  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).send();
    res.send(patient);
  } catch (e) {
    res.status(400).send(e);
  }
});

// elimino
router.delete("/:id", auth, permit("admin", "recepction"), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).send();
    res.send(patient);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
