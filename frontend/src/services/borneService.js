import api from './api';

export const borneService = {
  getByCircuit: (circuitId) => {
    return api.get(`/bornes/circuit/${circuitId}`)
      .then(response => response.data);
  },

  getMyBornes: () => {
    return api.get('/bornes/my-bornes')
      .then(response => response.data);
  },

  create: (borneData) => {
    return api.post('/bornes', borneData)
      .then(response => response.data);
  },

  update: (id, borneData) => {
    return api.put(`/bornes/${id}`, borneData)
      .then(response => response.data);
  },

  delete: (id) => {
    return api.delete(`/bornes/${id}`)
      .then(response => response.data);
  }
};