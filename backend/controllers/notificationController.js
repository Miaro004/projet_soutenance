const Notification = require('../models/Notification');

const notificationController = {
  getMyNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findByUser(req.user.id);
      res.json({ notifications });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des notifications.' });
    }
  },

  markAsRead: async (req, res) => {
    try {
      await Notification.markAsLu(req.params.id);
      res.json({ message: 'Notification marquée comme lue.' });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({ message: 'Erreur lors du marquage de la notification.' });
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      await Notification.markAllAsLu(req.user.id);
      res.json({ message: 'Toutes les notifications marquées comme lues.' });
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      res.status(500).json({ message: 'Erreur lors du marquage des notifications.' });
    }
  },

  getUnreadCount: async (req, res) => {
    try {
      const count = await Notification.countUnread(req.user.id);
      res.json({ count });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du nombre de notifications non lues.' });
    }
  }
};

module.exports = notificationController;