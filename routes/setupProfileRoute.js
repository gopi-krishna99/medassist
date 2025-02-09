const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// GET route: render the profile setup page
router.get('/setupProfile', authMiddleware, profileController.getSetupProfile);

// POST route: handle profile setup form submission
router.post('/setupProfile', authMiddleware, upload.single('profilePic'), profileController.postSetupProfile);

module.exports = router;
