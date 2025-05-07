const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const Doctor = require("../models/Doctor");

// creo doctor
const createDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Datos inválidos.", 422));
  }

  const doctor = new Doctor(req.body);
  try {
    await doctor.save();
    res.status(201).send(doctor);
  } catch (e) {
    next(new HttpError("Error al crear el doctor.", 400));
  }
};

const updateDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Los datos proporcionados no son válidos.", 422));
  }

  const updates = Object.keys(req.body);
  const allowed = ["firstName", "lastName", "specialty", "email", "active","maxAppointmentsPerDay"];
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) {
      return next(new HttpError("Doctor no encontrado", 404));
    }

    res.status(200).json({
      message: "Doctor actualizado correctamente",
      doctor,
    });
  } catch (e) {
    console.error(e);
    next(new HttpError("Error al actualizar doctor", 500));
  }
};




// obtengo un doctor por id
const getDoctor = async (req, res, next) => {
  const  {id}  = req.params;

  if (!id) {
    return next(new HttpError("ID de doctor requerido", 400));
  }

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return next(new HttpError("Doctor no encontrado", 404));
    }

    res.send(doctor);
  } catch (e) {
    next(new HttpError("Error al obtener doctor.", 500));
  }
};

// doctores por especialidad con paginación
const getDoctors = async (req, res, next) => {
  const { specialty, page = 1, limit = 10 } = req.query;

  if (!specialty) {
    return next(new HttpError("El filtro por especialidad es obligatorio", 400));
  }

  const match = {
    active: true,
    specialty: new RegExp(specialty, "i"),
  };

  try {
    const doctors = await Doctor.find(match)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Doctor.countDocuments(match);

    if (doctors.length === 0) {
      return next(new HttpError("No hay doctores con esa especialidad", 404));
    }

    res.send({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: doctors,
    });
  } catch (e) {
    next(new HttpError("Error al obtener doctores", 500));
  }
};

module.exports = {
  createDoctor,
  updateDoctor,
  getDoctor,
  getDoctors,
};
