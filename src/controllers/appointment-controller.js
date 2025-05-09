const { validationResult } = require("express-validator");
const HttpError = require("../util/http-error");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const paginate = require("../util/pagination");


const createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  const { time, date, status, patient, doctor } = req.body;

  try {
    const existingDoctor = await Doctor.findById(doctor);
    if (!existingDoctor || !existingDoctor.active) {
      return next(new HttpError("Doctor no válido o inactivo.", 404));
    }
    const existingPatient = await Patient.findById(patient);
    if (!existingPatient) {
      return next(new HttpError("Paciente no encontrado.", 404));
    }

    const existingAppointment = await Appointment.findOne({
      doctor,
      date,
      time,
    });
    if (existingAppointment) {
      return next(
        new HttpError(
          "Ya existe un turno para ese doctor en esa fecha y hora.",
          409
        )
      );
    }

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Turno creado correctamente", newAppointment });
  } catch (err) {
    console.log(err);
    next(new HttpError("Error al crear el turno.", 500));
  }
};

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
    res.send({message: "Detalles del turno", appointment});
  } catch (e) {
    return next(new HttpError("Turno no encontrado", 500));
  }
};

const updateAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }

  const updates = Object.keys(req.body);
  const allowed = ["time", "status", "date", "patient", "doctor"];
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
      message: "Turno actualizado correctamente",
      appointment,
    });
  } catch (e) {
    console.error(e);
    next(new HttpError("Error al actualizar estado", 500));
  }
};

const getAppointments = async (req, res, next) => {
  const { patient, doctor, page, limit } = req.query;

  const filter = {};
  if (patient) filter.patient = patient;
  if (doctor) filter.doctor = doctor;

  try {
    const result = await paginate(Appointment, filter, page, limit);

    if (result.data.length === 0) {
      return next(new HttpError("No se encontraron turnos", 404));
    }

    res.send({
      message: "Listado de turnos",
      ...result,
    });
  } catch (error) {
    console.log(error)
    next(new HttpError("Error al listar los turnos.", 500));
  }
};

module.exports = {
  createAppointment,
  getAppointment,
  updateAppointment,
  getAppointments,
};
