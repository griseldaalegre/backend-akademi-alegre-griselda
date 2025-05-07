const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Datos inválidos.", 422));
  }

  const { time, date, status, patient, doctor } = req.body;

  try {
    const existingDoctor = await Doctor.findById(doctor);
    // verifico que el doctor exista y este activo
    if (!existingDoctor || !existingDoctor.active) {
      return next(new HttpError("Doctor no válido o inactivo.", 404));
    }

    // verifico que el paciente exista
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      return next(new HttpError("Paciente no encontrado.", 404));
    }

    // creo el turno
    const newAppointment = new Appointment({
      time,
      date,
      status: status || "Confirmado",
      patient,
      doctor,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    next(new HttpError("Error al crear el turno.", 500));
  }
};

// obtengo un turno por id
const getAppointment = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new HttpError("Id del turno requerido", 400));
  }
  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return next(new HttpError("Turno no encontrado", 404));
    }
    res.send(appointment);
  } catch (e) {
    return next(new HttpError("Turno no encontrado", 500));
  }
};


const updateAppointmentStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Estado inválido.", 422));
  }

  const updates = Object.keys(req.body);
  const allowed = ["status"];
  const isValid = updates.every((u) => allowed.includes(u));

  if (!isValid) {
    return next(new HttpError("Actualización inválida", 400));
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return next(new HttpError("Turno no encontrado", 404));
    }

    res.status(200).json({
      message: "Estado actualizado correctamente",
      appointment,
    });
  } catch (e) {
    console.error(e);
    next(new HttpError("Error al actualizar estado", 500));
  }
};
module.exports = {
  createAppointment,
  getAppointment,
  updateAppointmentStatus
};
