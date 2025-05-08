const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const paginate = require("../util/pagination");

// creo doctor
const createDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
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

  if (req.body.active === false) {
    const appointments = await Appointment.find({ doctor: req.params.id });
    if (appointments.length > 0) {
      return next(new HttpError("No se puede deshabilitar un doctor con turnos asignados.", 400));
    }
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

// doctores activos y por especialidad con paginación
const getDoctors = async (req, res, next) => {
  const { specialty, page, limit } = req.query;

  if (!specialty) {
    return next(new HttpError("El filtro por especialidad es obligatorio", 400));
  }

  const filter = {
    active: true,
    specialty: new RegExp(specialty, "i"),
  };

  try {
    const result = await paginate(Doctor, filter, page, limit);

    if (result.data.length === 0) {
      return next(new HttpError("No hay doctores con esa especialidad", 404));
    }

    res.send({
      message: "Listado de doctores disponibles",
      ...result
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
