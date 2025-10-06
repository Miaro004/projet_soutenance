const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const User = require('../models/User');

const authController = {
  register: async (req, res) => {
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
      console.error('Register error:', error);
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérifier l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'sged_secret_key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Connexion réussie.',
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          fonction: user.fonction,
          telephone: user.telephone
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { nom, prenom, telephone } = req.body;
      const userId = req.user.id;

      await User.update(userId, { nom, prenom, telephone });

      res.json({ message: 'Profil mis à jour avec succès.' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
    }
  }
};

module.exports = authController;