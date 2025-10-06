const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage config for profile photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

router.get('/', auth, adminAuth, userController.getAllUsers);
router.get('/messaging', auth, userController.getUsersForMessaging);
router.get('/stats', auth, adminAuth, userController.getStats);
router.get('/:id', auth, adminAuth, userController.getUserById);
router.post('/', auth, adminAuth, validateUser, userController.createUser);
router.put('/:id', auth, adminAuth, upload.single('photo_profil'), userController.updateUser);
router.delete('/:id', auth, adminAuth, userController.deleteUser);

// New routes for profile update and password change
router.put('/profile', auth, upload.single('photo_profil'), userController.updateProfile);
router.put('/profile/password', auth, userController.changePassword);

module.exports = router;
