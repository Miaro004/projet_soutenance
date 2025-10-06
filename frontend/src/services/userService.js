import api from './api';

export const userService = {
  getAll: () => {
    return api.get('/users')
      .then(response => response.data);
  },

  getForMessaging: () => {
    return api.get('/users/messaging')
      .then(response => response.data);
  },

  getById: (id) => {
    return api.get(`/users/${id}`)
      .then(response => response.data);
  },

  create: (userData) => {
    return api.post('/users', userData)
      .then(response => response.data);
  },

  update: (id, userData) => {
    return api.put(`/users/${id}`, userData)
      .then(response => response.data);
  },

  updateProfile: (formData) => {
    return api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => response.data);
  },

  changePassword: (data) => {
    return api.put('/users/profile/password', data)
      .then(response => response.data);
  },

  delete: (id) => {
    return api.delete(`/users/${id}`)
      .then(response => response.data);
  },

  getStats: () => {
    return api.get('/users/stats')
      .then(response => response.data);
  }
};
