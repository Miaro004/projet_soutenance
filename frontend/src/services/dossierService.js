import api from './api';

export const dossierService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return api.get(`/dossiers?${params}`)
      .then(response => response.data);
  },

  getMyDossiers: () => {
    return api.get('/dossiers/my-dossiers')
      .then(response => response.data);
  },

  getById: (id) => {
    return api.get(`/dossiers/${id}`)
      .then(response => response.data);
  },

  create: (dossierData) => {
    return api.post('/dossiers', dossierData)
      .then(response => response.data);
  },

  update: (id, dossierData) => {
    return api.put(`/dossiers/${id}`, dossierData)
      .then(response => response.data);
  },

  sortir: (id, observations = '') => {
    return api.post(`/dossiers/${id}/sortir`, { observations })
      .then(response => response.data);
  },

  search: (query) => {
    return api.get(`/dossiers/search?query=${query}`)
      .then(response => response.data);
  },

  traiter: (id, observations = '') => {
    return api.post(`/dossiers/${id}/traiter`, { observations })
      .then(response => response.data);
  },

  getStats: () => {
    return api.get('/dossiers/stats')
      .then(response => response.data);
  }
};
