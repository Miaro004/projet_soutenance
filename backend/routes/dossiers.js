const express = require('express');
const router = express.Router();
const dossierController = require('../controllers/dossierController');
const { auth, adminAuth, accueilAuth, standardAuth } = require('../middleware/auth');
const { validateDossier } = require('../middleware/validation');

router.get('/', auth, dossierController.getAllDossiers);
router.get('/my-dossiers', auth, dossierController.getMyDossiers);
router.get('/stats', auth, adminAuth, dossierController.getStats);
router.get('/search', auth, dossierController.searchDossiers);
router.get('/:id', auth, dossierController.getDossierById);
router.post('/', auth, accueilAuth, validateDossier, dossierController.createDossier);
router.put('/:id', auth, adminAuth, dossierController.updateDossier);
router.post('/:id/sortir', auth, accueilAuth, dossierController.sortirDossier);
router.post('/:id/traiter', auth, standardAuth, dossierController.traiterDossier);

module.exports = router;