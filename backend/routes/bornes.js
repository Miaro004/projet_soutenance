const express = require('express');
const router = express.Router();
const borneController = require('../controllers/borneController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateBorne } = require('../middleware/validation');

router.get('/circuit/:circuitId', auth, borneController.getBornesByCircuit);
router.get('/my-bornes', auth, borneController.getMyBornes);
router.post('/', auth, adminAuth, validateBorne, borneController.createBorne);
router.put('/:id', auth, adminAuth, borneController.updateBorne);
router.delete('/:id', auth, adminAuth, borneController.deleteBorne);

module.exports = router;