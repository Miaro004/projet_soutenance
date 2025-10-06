import api from './api';

export const messageService = {
  getMyMessages: () => {
    return api.get('/messages')
      .then(response => response.data);
  },

  getConversation: (userId) => {
    return api.get(`/messages/conversation/${userId}`)
      .then(response => response.data);
  },

  send: (messageData) => {
    return api.post('/messages', messageData)
      .then(response => response.data);
  },

  markAsRead: (id) => {
    return api.put(`/messages/${id}/read`)
      .then(response => response.data);
  },

  getUnreadCount: () => {
    return api.get('/messages/unread-count')
      .then(response => response.data);
  }
};