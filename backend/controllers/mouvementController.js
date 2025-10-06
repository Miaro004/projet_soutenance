const Mouvement = require('../models/Mouvement');
const Dossier = require('../models/Dossier');
const Borne = require('../models/Borne');
const Historique = require('../models/Historique');
const Notification = require('../models/Notification');

const mouvementController = {
  arriverDossier: async (req, res) => {
    try {
      const dossierId = req.params.id;
      const { observations } = req.body;

      // Récupérer le dossier
      const dossier = await Dossier.findById(dossierId);
      if (!dossier) {
        return res.status(404).json({ message: 'Dossier non trouvé.' });
      }

      // Vérifier si l'utilisateur est bien assigné à la borne actuelle
      const borneActuelle = await Borne.findById(dossier.borne_actuelle);
      if (!borneActuelle || borneActuelle.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à traiter ce dossier.' });
      }

      // Enregistrer le mouvement d'arrivée
      await Mouvement.create({
        dossier_id: dossierId,
        borne_id: dossier.borne_actuelle,
        type_mouvement: 'arrivee',
        user_id: req.user.id,
        observations
      });

      // Mettre à jour le statut du dossier
      await Dossier.updateStatut(dossierId, 'en_cours');

      // Créer l'historique
      await Historique.create({
        dossier_id: dossierId,
        action: 'ARRIVEE_DOSSIER',
        details: `Dossier arrivé à la borne ${borneActuelle.rang} - Traité par ${req.user.nom} ${req.user.prenom}`,
        user_id: req.user.id
      });

      res.json({ message: 'Arrivée du dossier enregistrée avec succès.' });
    } catch (error) {
      console.error('Arriver dossier error:', error);
      res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'arrivée du dossier.' });
    }
  },

  getMouvementsByDossier: async (req, res) => {
    try {
      const mouvements = await Mouvement.findByDossier(req.params.dossierId);
      res.json({ mouvements });
    } catch (error) {
      console.error('Get mouvements error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des mouvements.' });
    }
  }
};

module.exports = mouvementController;