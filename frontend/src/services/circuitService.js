import api from './api';

export const circuitService = {
  getAll: () => {
    return api.get('/circuits')
      .then(response => response.data);
  },

  getById: (id) => {
    return api.get(`/circuits/${id}`)
      .then(response => response.data);
  },

  create: (circuitData) => {
    return api.post('/circuits', circuitData)
      .then(response => response.data);
  },

  update: (id, circuitData) => {
    return api.put(`/circuits/${id}`, circuitData)
      .then(response => response.data);
  },

  delete: (id) => {
    return api.delete(`/circuits/${id}`)
      .then(response => response.data);
  }
};