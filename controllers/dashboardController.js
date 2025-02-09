const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    // Ensure the user is logged in
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.redirect('/login');
    }
    // Render the appropriate dashboard based on user role
    if (user.role === 'doctor') {
      return res.render('dashboard_doctor', { user });
    } else {
      return res.render('dashboard_patient', { user });
    }
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { getDashboard };
