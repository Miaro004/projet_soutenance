import api from './api';

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
      .then(response => response.data);
  },

  register: (userData) => {
    return api.post('/auth/register', userData)
      .then(response => response.data);
  },

  getProfile: () => {
    return api.get('/auth/profile')
      .then(response => response.data.user);
  },

  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData)
      .then(response => response.data);
  }
};