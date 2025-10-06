const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dossierRoutes = require('./routes/dossiers');
const circuitRoutes = require('./routes/circuits');
const borneRoutes = require('./routes/bornes');
const mouvementRoutes = require('./routes/mouvements');
const historiqueRoutes = require('./routes/historiques');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (photos de profil)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dossiers', dossierRoutes);
app.use('/api/circuits', circuitRoutes);
app.use('/api/bornes', borneRoutes);
app.use('/api/mouvements', mouvementRoutes);
app.use('/api/historiques', historiqueRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'SGED API is running', 
    timestamp: new Date().toISOString() 
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});