const db = require('../config/database');
const Circuit = require('../models/Circuit');
const Borne = require('../models/Borne');

const circuitController = {
  createCircuit: async (req, res) => {
    try {
      const { nom, description, nombre_bornes } = req.body;
      const created_by = req.user.id;

      const circuitId = await Circuit.create({
        nom,
        description,
        nombre_bornes,
        created_by
      });

      res.status(201).json({ 
        message: 'Circuit créé avec succès.',
        circuit: { id: circuitId, nom, nombre_bornes }
      });
    } catch (error) {
      console.error('Create circuit error:', error);
      res.status(500).json({ message: 'Erreur lors de la création du circuit.' });
    }
  },

  getAllCircuits: async (req, res) => {
    try {
      const circuits = await Circuit.findAll();
      res.json({ circuits });
    } catch (error) {
      console.error('Get circuits error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des circuits.' });
    }
  },

  getCircuitById: async (req, res) => {
    try {
      const circuit = await Circuit.findById(req.params.id);
      if (!circuit) {
        return res.status(404).json({ message: 'Circuit non trouvé.' });
      }

      // Récupérer les bornes du circuit
      const bornes = await Borne.findByCircuit(req.params.id);

      res.json({ circuit, bornes });
    } catch (error) {
      console.error('Get circuit error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du circuit.' });
    }
  },

  updateCircuit: async (req, res) => {
    try {
      const { nom, description, nombre_bornes, is_active } = req.body;
      
      await Circuit.update(req.params.id, {
        nom,
        description,
        nombre_bornes,
        is_active
      });

      res.json({ message: 'Circuit mis à jour avec succès.' });
    } catch (error) {
      console.error('Update circuit error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du circuit.' });
    }
  },

  deleteCircuit: async (req, res) => {
    try {
      await Circuit.delete(req.params.id);
      res.json({ message: 'Circuit désactivé avec succès.' });
    } catch (error) {
      console.error('Delete circuit error:', error);
      res.status(500).json({ message: 'Erreur lors de la désactivation du circuit.' });
    }
  }
};

module.exports = circuitController;
