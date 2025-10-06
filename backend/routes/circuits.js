const express = require('express');
const router = express.Router();
const circuitController = require('../controllers/circuitController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateCircuit } = require('../middleware/validation');

router.get('/', auth, circuitController.getAllCircuits);
router.get('/:id', auth, circuitController.getCircuitById);
router.post('/', auth, adminAuth, validateCircuit, circuitController.createCircuit);
router.put('/:id', auth, adminAuth, circuitController.updateCircuit);
router.delete('/:id', auth, adminAuth, circuitController.deleteCircuit);

module.exports = router;