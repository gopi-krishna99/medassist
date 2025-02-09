const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // imported directly
const Patient = require('../models/Patient');
const User = require('../models/User');

// Middleware to check if the logged-in user is a doctor
const doctorMiddleware = async (req, res, next) => {
  try {
    const doctor = await User.findById(req.session.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.doctor = doctor; // Store doctor info in request object
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all patients assigned to the logged-in doctor
router.get('/patients', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find({ doctor: req.doctor._id });
    // Render the doctor dashboard with the list of patients
    res.render('dashboard_doctor', { user: req.doctor, patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch a single patient's details (doctors only)
router.get('/patients/:id', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    // Render the patient dashboard view with patient details
    res.render('dashboard_patient', { user: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Allow doctors to update patient records
router.post('/patients/:id/update', authMiddleware, doctorMiddleware, async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, medicalHistory } = req.body;
    // Build an update object from provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;
    if (bloodGroup) updateFields.bloodGroup = bloodGroup;
    if (medicalHistory) updateFields.medicalHistory = medicalHistory;

    const patient = await Patient.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.redirect(`/patients/${req.params.id}`); // Redirect to view the updated patient details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
