const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String, required: true },
  medicalHistory: { type: String, default: 'No history available' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User (Doctor)
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
