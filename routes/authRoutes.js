const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const User = require('../models/User'); // Ensure User model is imported

// Register Routes
router.post('/register', registerUser);  // POST request to register user
router.post('/login', loginUser);        // POST request to log in user
router.get('/logout', logoutUser);         // GET request to log out user

module.exports = router;
