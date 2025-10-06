const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sged_secret_key');
    
    // Vérifier si l'utilisateur existe toujours
    const user = await db.query(
      'SELECT id, nom, prenom, email, role, fonction, is_active FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.id]
    );

    if (user.length === 0) {
      return res.status(401).json({ message: 'Token invalid. User not found.' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

const accueilAuth = (req, res, next) => {
  if (req.user.role !== 'user_accueil' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. User accueil role required.' });
  }
  next();
};

const standardAuth = (req, res, next) => {
  if (req.user.role !== 'user_standard' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. User standard role required.' });
  }
  next();
};

module.exports = { auth, adminAuth, accueilAuth, standardAuth };
