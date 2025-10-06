const Message = require('../models/Message');
const User = require('../models/User');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { destinataire_id, sujet, contenu } = req.body;
      const expediteur_id = req.user.id;

      // Vérifier si le destinataire existe
      const destinataire = await User.findById(destinataire_id);
      if (!destinataire) {
        return res.status(400).json({ message: 'Destinataire non trouvé.' });
      }

      const messageId = await Message.create({
        expediteur_id,
        destinataire_id,
        sujet,
        contenu
      });

      res.status(201).json({ 
        message: 'Message envoyé avec succès.',
        message: { id: messageId }
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Erreur lors de l\'envoi du message.' });
    }
  },

  getMyMessages: async (req, res) => {
    try {
      const messages = await Message.findByUser(req.user.id);
      res.json({ messages });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
    }
  },

  getConversation: async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await Message.findConversation(req.user.id, userId);
      res.json({ messages });
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de la conversation.' });
    }
  },

  markAsRead: async (req, res) => {
    try {
      await Message.markAsLu(req.params.id);
      res.json({ message: 'Message marqué comme lu.' });
    } catch (error) {
      console.error('Mark message as read error:', error);
      res.status(500).json({ message: 'Erreur lors du marquage du message.' });
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const count = await Message.countUnread(req.user.id);
      res.json({ count });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du nombre de messages non lus.' });
    }
  }
};

module.exports = messageController;