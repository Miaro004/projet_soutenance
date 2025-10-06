const Historique = require('../models/Historique');

const historiqueController = {
  getHistoriqueByDossier: async (req, res) => {
    try {
      const historiques = await Historique.findByDossier(req.params.dossierId);
      res.json({ historiques });
    } catch (error) {
      console.error('Get historique error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique.' });
    }
  },

  getAllHistoriques: async (req, res) => {
    try {
      const { user_id, date_debut, date_fin } = req.query;
      const filters = { user_id, date_debut, date_fin };
      
      const historiques = await Historique.findAll(filters);
      res.json({ historiques });
    } catch (error) {
      console.error('Get all historiques error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des historiques.' });
    }
  }
};

module.exports = historiqueController;