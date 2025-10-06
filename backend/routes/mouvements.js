const express = require('express');
const router = express.Router();
const mouvementController = require('../controllers/mouvementController');
const { auth } = require('../middleware/auth');

router.get('/dossier/:dossierId', auth, mouvementController.getMouvementsByDossier);
router.post('/:id/arriver', auth, mouvementController.arriverDossier);

module.exports = router;