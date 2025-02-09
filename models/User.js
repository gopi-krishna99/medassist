const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },

  // Unique identifiers for patients and doctors.
  // (Using sparse ensures that if the field is not set, it’s not indexed.)
  patientId: { type: String, unique: true, sparse: true },
  doctorId: { type: String, unique: true, sparse: true },

  // Personal details
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  contactNumber: { type: String },
  address: { type: String },

  // Medical information
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  bmi: { type: Number },
  allergies: [{ type: String }],
  chronicDiseases: [{ type: String }],
  currentMedications: [{ type: String }],
  pastSurgeries: [{ type: String }],
  familyMedicalHistory: [{ type: String }],
  vaccinationRecords: [{ type: String }],

  // Emergency & Additional Info
  emergencyContact: { name: String, phone: String },
  insuranceDetails: { type: String },
  organDonor: { type: Boolean, default: false },
  lifestyleHabits: { smoking: Boolean, alcohol: Boolean, exercise: String, diet: String },

  // Profile Picture (optional)
  profilePicture: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware: hash password, generate unique IDs, and auto-calculate fields.
UserSchema.pre('save', async function (next) {
  try {
    // Hash the password if it was modified.
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // For new documents, generate a unique UUID for patientId or doctorId.
    if (this.isNew) {
      if (this.role === 'patient' && !this.patientId) {
        this.patientId = uuidv4();
      }
      if (this.role === 'doctor' && !this.doctorId) {
        this.doctorId = uuidv4();
      }
    }

    // Auto-calculate Age from Date of Birth
    if (this.dob) {
      const today = new Date();
      this.age = today.getFullYear() - this.dob.getFullYear();
    }

    // Auto-calculate BMI if both height and weight are provided
    if (this.height && this.weight) {
      this.bmi = parseFloat((this.weight / ((this.height / 100) ** 2)).toFixed(2));
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
