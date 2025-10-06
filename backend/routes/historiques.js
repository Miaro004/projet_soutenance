const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/historiqueController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/dossier/:dossierId', auth, historiqueController.getHistoriqueByDossier);
router.get('/', auth, adminAuth, historiqueController.getAllHistoriques);

module.exports = router;