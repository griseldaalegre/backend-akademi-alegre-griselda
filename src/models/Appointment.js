const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    time: { type: String, required: true }, 
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
    }, 
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    }, 
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
