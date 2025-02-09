const User = require('../models/User');

exports.getSetupProfile = async (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect('/login');
  }
  res.render('setupProfile', { error: null });
};

exports.postSetupProfile = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }

    const user = await User.findById(req.session.user.id);
    if (!user) return res.redirect('/login');

    user.fullName = req.body.fullName || user.fullName;
    user.dob = req.body.dob;
    user.gender = req.body.gender;
    user.profilePic = req.file ? `/uploads/${req.file.filename}` : user.profilePic;

    await user.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Error updating profile');
  }
};

// ✅ Added missing `uploadProfilePic` function
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.session.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully!', filePath: user.profilePic });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error while uploading file' });
  }
};
