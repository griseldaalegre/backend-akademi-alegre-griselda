const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const Patient = require("../models/Patient");

// creo paciente

const createPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Datos inválidos. ", 422));
  }

  const patient = new Patient(req.body);
  try {
    await patient.save();
    res.status(201).send(patient);
  } catch (e) {
    next(new HttpError("Error al crear el paciente.", 400));
  }
};

const updatePatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Datos inválidos. ", 422));
  }

  const updates = Object.keys(req.body); //revisar
  const allowed = [
    "name",
    "dni",
    "healthInsurance",
    "phone",
    "address",
    "birthDate",
  ];
  const isValid = updates.every((u) => allowed.includes(u)); //revisar
  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body);
    if (!patient) return next(new HttpError("Paciente no encontrado", 404));
    res.send(patient);
  } catch (e) {
    next(new HttpError("Error al actualizar paciente.", 400));
  }
};


// elimino paciente
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return next(new HttpError("Paciente no encontrado", 404));
    }
    res.send(patient);
  } catch (e) {
    next(new HttpError("Error al eliminar el paciente", 500));
  }
};


// Listar pacientes con filtros y paginación
const getPatients = async (req, res, next) => {
  const { name, dni, healthInsurance, page = 1, limit = 10 } = req.query;
  const match = {};

  if (name) match.name = new RegExp(name, "i");
  if (dni) match.dni = dni;
  if (healthInsurance) match.healthInsurance = new RegExp(healthInsurance, "i");

  try {
    const patients = await Patient.find(match)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Patient.countDocuments(match);

    res.send({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: patients,
    });
  } catch (e) {
    next(new HttpError("Error al obtener los pacientes", 500));
  }
};


const getPatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new HttpError("ID de paciente requerido", 400));
    }

    const patient = await Patient.findById(id);
    if (!patient) {
      return next(new HttpError("Paciente no encontrado", 404));
    }

    res.send(patient);
  } catch (e) {
    next(new HttpError("Error al obtener paciente", 500));
  }
};


module.exports = {
  createPatient,
  updatePatient,
  deletePatient,
  getPatient,
  getPatients,
};

