const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.registerUser = async (req, res) => {
  try {
    // Expecting: fullName, email, password, and role
    const { fullName, email, password, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return res.render('register', { error: 'All fields are required' });
    }

    // Check if a user with the given email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.render('register', { error: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object.
    // Note: The User model's pre-save middleware will also generate patientId/doctorId.
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      // Optionally, you can generate IDs here:
      // patientId: role === 'patient' ? uuidv4() : undefined,
      // doctorId: role === 'doctor' ? uuidv4() : undefined,
    });

    await user.save();

    // Store user in session for subsequent requests
    req.session.user = { id: user._id, role: user.role };

    // Redirect to the profile setup page after registration
    res.redirect('/setupProfile');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Server error. Please try again.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.user = { id: user._id, role: user.role };
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Server error. Please try again.' });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
