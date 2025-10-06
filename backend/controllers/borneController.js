const db = require('../config/database');
const Borne = require('../models/Borne');
const Circuit = require('../models/Circuit');
const User = require('../models/User');

const borneController = {
  createBorne: async (req, res) => {
    try {
      const { circuit_id, rang, user_id, conditions } = req.body;

      // Vérifier si le circuit existe
      const circuit = await Circuit.findById(circuit_id);
      if (!circuit) {
        return res.status(400).json({ message: 'Circuit non trouvé.' });
      }

      // Vérifier si l'utilisateur existe
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé.' });
      }

      // Vérifier si le rang est disponible
      const existingBorne = await db.query(
        'SELECT * FROM bornes WHERE circuit_id = ? AND rang = ?',
        [circuit_id, rang]
      );
      if (existingBorne.length > 0) {
        return res.status(400).json({ message: 'Ce rang est déjà occupé dans ce circuit.' });
      }

      const borneId = await Borne.create({
        circuit_id,
        rang,
        user_id,
        conditions
      });

      res.status(201).json({ 
        message: 'Borne créée avec succès.',
        borne: { id: borneId, circuit_id, rang, user_id }
      });
    } catch (error) {
      console.error('Create borne error:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la borne.' });
    }
  },

  getBornesByCircuit: async (req, res) => {
    try {
      const bornes = await Borne.findByCircuit(req.params.circuitId);
      res.json({ bornes });
    } catch (error) {
      console.error('Get bornes error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des bornes.' });
    }
  },

  getMyBornes: async (req, res) => {
    try {
      const bornes = await Borne.findByUser(req.user.id);
      res.json({ bornes });
    } catch (error) {
      console.error('Get my bornes error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de vos bornes.' });
    }
  },

  updateBorne: async (req, res) => {
    try {
      const { circuit_id, rang, user_id, conditions } = req.body;
      
      await Borne.update(req.params.id, {
        circuit_id,
        rang,
        user_id,
        conditions
      });

      res.json({ message: 'Borne mise à jour avec succès.' });
    } catch (error) {
      console.error('Update borne error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la borne.' });
    }
  },

  deleteBorne: async (req, res) => {
    try {
      await Borne.delete(req.params.id);
      res.json({ message: 'Borne supprimée avec succès.' });
    } catch (error) {
      console.error('Delete borne error:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la borne.' });
    }
  }
};

module.exports = borneController;