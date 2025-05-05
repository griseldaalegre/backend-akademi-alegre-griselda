const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  healthInsurance: { type: String, required: true },
  phone: String,
  address: String,
  birthDate: Date,
}, {
  timestamps: true
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
