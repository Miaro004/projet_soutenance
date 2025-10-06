import api from './api';

export const notificationService = {
  getMyNotifications: () => {
    return api.get('/notifications')
      .then(response => response.data);
  },

  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`)
      .then(response => response.data);
  },

  markAllAsRead: () => {
    return api.put('/notifications/read-all')
      .then(response => response.data);
  },

  getUnreadCount: () => {
    return api.get('/notifications/unread-count')
      .then(response => response.data);
  }
};