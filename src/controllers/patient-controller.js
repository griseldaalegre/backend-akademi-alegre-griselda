const Patient = require("../models/Patient");

// creo paciente
const createPatient = async (req, res) => {
  const patient = new Patient(req.body);
  try {
    await patient.save();
    res.status(201).send(patient);
  } catch (e) {
    res.status(400).send(e);
  }
};

const updatePatient = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "dni", "healthInsurance", "phone", "address", "birthDate"];
  const isValid = updates.every(u => allowed.includes(u));
  if (!isValid) return res.status(400).send({ error: "Actualización invalida" });

  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).send({ error: "Paciente no encontrado" });
    res.send(patient);
  } catch (e) {
    res.status(400).send(e);
  }
};

// elimino paciente
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).send({ error: "Paciente no encontrado" });
    res.send(patient);
  } catch (e) {
    res.status(500).send({ error: "Error al eliminar el paciente" });
  }
};




const getPatient = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({ error: "ID de paciente requerido" });
    }

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).send({ error: "Paciente no encontrado" });
    }

    res.send(patient);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "Error al obtener paciente." });
  }
};


module.exports = {
  createPatient,
  updatePatient,
  deletePatient,
  getPatient
};
