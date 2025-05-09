const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const Patient = require("../models/Patient");
const paginate = require("../util/pagination");

const createPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  try {
    const existingPatient = await Patient.findOne({ dni: req.body.dni });
    if (existingPatient) {
      return next(new HttpError("El paciente ya esta registrado.", 409));
    }

    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).send({message:"Paciente creado correctamente", patient});
  } catch (e) {
    next(new HttpError("Error al crear el paciente.", 400));
  }
};


const updatePatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  const updates = Object.keys(req.body);
  
  const allowed = [
    "name",
    "dni",
    "healthInsurance",
  ];

  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    if (!patient) return next(new HttpError("Paciente no encontrado", 404));
    
    res.send({ message: "Paciente editado correctamente", patient });
  } catch (e) {
    next(new HttpError("Error al actualizar paciente.", 400));
  }
};


const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return next(new HttpError("Paciente no encontrado", 404));
    }
    res.status(200).json({
      message: "Usuario eliminado correctamente",
      patient
    });
  } catch (e) {
    next(new HttpError("Error al eliminar el paciente", 500));
  }
};

const getPatients = async (req, res, next) => {
  const { name, dni, healthInsurance, page, limit} = req.query;

  const filter = {};

  if (name) filter.name = new RegExp(name, "i");
  if (dni) filter.dni = dni;
  if (healthInsurance) filter.healthInsurance = new RegExp(healthInsurance, "i");

  try {
    const result = await paginate(Patient, filter, page, limit);
    if (result.data.length === 0) {
      return next(new HttpError("No se encontraron pacientes con esos criterios", 404));
    }

    res.send({
      message: "Listado de pacientes",
      ...result
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

    res.send({message:"Detalles de paciente",patient});
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
