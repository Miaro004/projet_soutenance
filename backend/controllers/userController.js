const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour l'upload des photos de profil
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

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { nom, prenom, email, password, role, fonction, telephone } = req.body;

      // Vérifier si l'email existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const userId = await User.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
        fonction,
        telephone
      });

      res.status(201).json({ 
        message: 'Utilisateur créé avec succès.',
        user: { id: userId, nom, prenom, email, role, fonction }
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { nom, prenom, email, role, fonction, telephone, is_active } = req.body;
      const userId = req.params.id;

      // Handle profile photo upload if present
      let photo_profil;
      if (req.file) {
        photo_profil = req.file.filename;
      }

      const updateData = { nom, prenom, email, role, fonction, telephone, is_active };
      if (photo_profil) {
        updateData.photo_profil = photo_profil;
      }

      await User.update(userId, updateData);

      res.json({ message: 'Utilisateur mis à jour avec succès.' });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await User.delete(req.params.id);
      res.json({ message: 'Utilisateur désactivé avec succès.' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Erreur lors de la désactivation de l\'utilisateur.' });
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await User.countByRole();
      res.json({ stats });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
    }
  },

  getUsersForMessaging: async (req, res) => {
    try {
      const users = await User.findAll();
      // Return only active users except the current user
      const filteredUsers = users.filter(u => u.id !== req.user.id && u.is_active);
      res.json(filteredUsers);
    } catch (error) {
      console.error('Get users for messaging error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { telephone } = req.body;
      const userId = req.user.id;

      // Handle profile photo upload if present
      let photo_profil;
      if (req.file) {
        photo_profil = req.file.filename;
      }

      const updateData = { telephone };
      if (photo_profil) {
        updateData.photo_profil = photo_profil;
      }

      await User.update(userId, updateData);

      // Get updated user data
      const updatedUser = await User.findById(userId);

      res.json({
        message: 'Profil mis à jour avec succès.',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get current user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await User.update(userId, { password: hashedNewPassword });

      res.json({ message: 'Mot de passe changé avec succès.' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Erreur lors du changement de mot de passe.' });
    }
  }
};

module.exports = userController;