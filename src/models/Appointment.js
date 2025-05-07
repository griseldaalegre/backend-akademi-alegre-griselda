const mongoose = require('mongoose');


const appointmentSchema = new mongoose.Schema(
  {
    time: { type: String, required: true }, // ej. "14:30"
    status: {
      type: String,
      enum: ["Confirmado", "Cancelado"],
      default: "Confirmado",
    },
    date: { type: Date, required: true },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    }, //referencia a coleccion paciente
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    }, //referencia a coleccion doctor
  },
  {
    timestamps: true,
  }
);

// Evita duplicados para un mismo doctor en misma fecha/hora
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
