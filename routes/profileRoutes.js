const express = require('express');
const multer = require('multer');
const path = require('path');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// GET route to render the profile setup page
router.get('/setup-profile', authMiddleware, profileController.getSetupProfile);

// POST route to handle profile setup form submission (with file upload)
router.post('/setup-profile', authMiddleware, upload.single('profilePic'), profileController.postSetupProfile);

module.exports = router;
