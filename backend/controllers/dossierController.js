const db = require('../config/database');
const Dossier = require('../models/Dossier');
const Circuit = require('../models/Circuit');
const Borne = require('../models/Borne');
const Mouvement = require('../models/Mouvement');
const Historique = require('../models/Historique');
const Notification = require('../models/Notification');

const dossierController = {
  createDossier: async (req, res) => {
    try {
      const { numero_dossier, type_dossier, description, informations_client, circuit_id } = req.body;
      const created_by = req.user.id;

      // Vérifier si le numéro de dossier existe déjà
      const existingDossier = await Dossier.findByNumero(numero_dossier);
      if (existingDossier) {
        return res.status(400).json({ message: 'Un dossier avec ce numéro existe déjà.' });
      }

      // Vérifier si le circuit existe
      const circuit = await Circuit.findById(circuit_id);
      if (!circuit) {
        return res.status(400).json({ message: 'Circuit non trouvé.' });
      }

      // Créer le dossier
      const dossierId = await Dossier.create({
        numero_dossier,
        type_dossier,
        description,
        informations_client,
        circuit_id,
        created_by,
        statut: 'en_attente'
      });

      // Récupérer la première borne du circuit
      const firstBorne = await Borne.findByCircuit(circuit_id);
      if (firstBorne.length > 0) {
        await Dossier.updateBorneActuelle(dossierId, firstBorne[0].id);

        // Créer une notification pour l'utilisateur de la première borne
        await Notification.create({
          user_id: firstBorne[0].user_id,
          type: 'DOSSIER_EN_ATTENTE',
          titre: 'Nouveau dossier en attente',
          message: `Le dossier ${numero_dossier} a été créé et vous sera bientôt assigné.`,
          lien: `/user/dossiers`
        });
      }

      // Créer l'historique
      await Historique.create({
        dossier_id: dossierId,
        action: 'CREATION_DOSSIER',
        details: `Dossier créé par ${req.user.nom} ${req.user.prenom}`,
        user_id: created_by
      });

      res.status(201).json({ 
        message: 'Dossier créé avec succès.',
        dossier: { id: dossierId, numero_dossier }
      });
    } catch (error) {
      console.error('Create dossier error:', error);
      res.status(500).json({ message: 'Erreur lors de la création du dossier.' });
    }
  },

  getAllDossiers: async (req, res) => {
    try {
      const { statut, type_dossier, circuit_id } = req.query;
      const filters = { statut, type_dossier, circuit_id };
      
      const dossiers = await Dossier.findAll(filters);
      res.json({ dossiers });
    } catch (error) {
      console.error('Get dossiers error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des dossiers.' });
    }
  },

  getDossierById: async (req, res) => {
    try {
      const dossier = await Dossier.findById(req.params.id);
      if (!dossier) {
        return res.status(404).json({ message: 'Dossier non trouvé.' });
      }

      // Vérifier les permissions d'accès
      if (req.user.role === 'user_standard') {
        // Les users standards ne voient pas toutes les informations
        delete dossier.informations_client;
      }

      res.json({ dossier });
    } catch (error) {
      console.error('Get dossier error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du dossier.' });
    }
  },

  getMyDossiers: async (req, res) => {
    try {
      const dossiers = await Dossier.getDossiersByUser(req.user.id, req.user.role);
      res.json({ dossiers });
    } catch (error) {
      console.error('Get my dossiers error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de vos dossiers.' });
    }
  },

  updateDossier: async (req, res) => {
    try {
      const { type_dossier, description, informations_client, circuit_id, borne_actuelle, statut } = req.body;
      
      await Dossier.update(req.params.id, {
        type_dossier,
        description,
        informations_client,
        circuit_id,
        borne_actuelle,
        statut
      });

      // Créer l'historique
      await Historique.create({
        dossier_id: req.params.id,
        action: 'MODIFICATION_DOSSIER',
        details: `Dossier modifié par ${req.user.nom} ${req.user.prenom}`,
        user_id: req.user.id
      });

      res.json({ message: 'Dossier mis à jour avec succès.' });
    } catch (error) {
      console.error('Update dossier error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du dossier.' });
    }
  },

  sortirDossier: async (req, res) => {
    try {
      const dossierId = req.params.id;
      const { observations } = req.body;

      // Récupérer le dossier
      const dossier = await Dossier.findById(dossierId);
      if (!dossier) {
        return res.status(404).json({ message: 'Dossier non trouvé.' });
      }

      // Récupérer la borne actuelle
      const borneActuelle = await Borne.findById(dossier.borne_actuelle);
      if (!borneActuelle) {
        return res.status(400).json({ message: 'Borne actuelle non trouvée.' });
      }

      // Récupérer la prochaine borne
      const nextBorne = await Borne.getNextBorne(dossier.circuit_id, borneActuelle.rang);
      if (!nextBorne) {
        return res.status(400).json({ message: 'Aucune borne suivante trouvée. Le circuit est terminé.' });
      }

      // Enregistrer le mouvement de sortie
      await Mouvement.create({
        dossier_id: dossierId,
        borne_id: dossier.borne_actuelle,
        type_mouvement: 'sortie',
        user_id: req.user.id,
        observations
      });

      // Mettre à jour la borne actuelle
      await Dossier.updateBorneActuelle(dossierId, nextBorne.id);
      await Dossier.updateStatut(dossierId, 'en_cours');

      // Créer l'historique
      await Historique.create({
        dossier_id: dossierId,
        action: 'SORTIE_DOSSIER',
        details: `Dossier sorti de la borne ${borneActuelle.rang} vers la borne ${nextBorne.rang}`,
        user_id: req.user.id
      });

      // Créer une notification pour l'utilisateur de la prochaine borne
      await Notification.create({
        user_id: nextBorne.user_id,
        type: 'NOUVEAU_DOSSIER',
        titre: 'Nouveau dossier à traiter',
        message: `Le dossier ${dossier.numero_dossier} est arrivé à votre borne.`,
        lien: `/dossiers/${dossierId}`
      });

      res.json({ message: 'Dossier sorti avec succès.' });
    } catch (error) {
      console.error('Sortir dossier error:', error);
      res.status(500).json({ message: 'Erreur lors de la sortie du dossier.' });
    }
  },

  searchDossiers: async (req, res) => {
    try {
      const { query } = req.query;

      const searchQuery = `
        SELECT d.*, c.nom as circuit_nom,
               u.nom as user_nom, u.prenom as user_prenom
        FROM dossiers d
        LEFT JOIN circuits c ON d.circuit_id = c.id
        LEFT JOIN bornes b ON d.borne_actuelle = b.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE d.numero_dossier LIKE ? OR d.type_dossier LIKE ? OR c.nom LIKE ?
        ORDER BY d.date_creation DESC
      `;

      const dossiers = await db.query(searchQuery, [`%${query}%`, `%${query}%`, `%${query}%`]);
      res.json({ dossiers });
    } catch (error) {
      console.error('Search dossiers error:', error);
      res.status(500).json({ message: 'Erreur lors de la recherche des dossiers.' });
    }
  },

  traiterDossier: async (req, res) => {
    try {
      const dossierId = req.params.id;
      const { observations } = req.body;

      // Récupérer le dossier
      const dossier = await Dossier.findById(dossierId);
      if (!dossier) {
        return res.status(404).json({ message: 'Dossier non trouvé.' });
      }

      // Vérifier que l'utilisateur est bien assigné à la borne actuelle
      if (dossier.borne_actuelle) {
        const borneActuelle = await Borne.findById(dossier.borne_actuelle);
        if (borneActuelle.user_id !== req.user.id) {
          return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à traiter ce dossier.' });
        }

        // Vérifier que c'est la dernière borne du circuit
        const nextBorne = await Borne.getNextBorne(dossier.circuit_id, borneActuelle.rang);
        if (nextBorne) {
          return res.status(400).json({ message: 'Ce n\'est pas la dernière borne du circuit.' });
        }
      }

      // Enregistrer le mouvement de traitement
      if (dossier.borne_actuelle) {
        await Mouvement.create({
          dossier_id: dossierId,
          borne_id: dossier.borne_actuelle,
          type_mouvement: 'traitement',
          user_id: req.user.id,
          observations
        });
      }

      // Mettre à jour le statut du dossier
      await Dossier.updateStatut(dossierId, 'traite');

      // Créer l'historique
      await Historique.create({
        dossier_id: dossierId,
        action: 'TRAITEMENT_DOSSIER',
        details: `Dossier traité par ${req.user.nom} ${req.user.prenom}`,
        user_id: req.user.id
      });

      // Créer une notification pour l'admin
      const adminUsers = await db.query('SELECT id FROM users WHERE role = ? AND is_active = TRUE', ['admin']);
      for (const admin of adminUsers) {
        await Notification.create({
          user_id: admin.id,
          type: 'DOSSIER_TRAITE',
          titre: 'Dossier traité',
          message: `Le dossier ${dossier.numero_dossier} a été traité par ${req.user.nom} ${req.user.prenom}.`,
          lien: `/admin/dossiers/${dossierId}`
        });
      }

      res.json({ message: 'Dossier traité avec succès.' });
    } catch (error) {
      console.error('Traiter dossier error:', error);
      res.status(500).json({ message: 'Erreur lors du traitement du dossier.' });
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await Dossier.countByStatut();
      res.json({ stats });
    } catch (error) {
      console.error('Get dossier stats error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques.' });
    }
  }
};

module.exports = dossierController;