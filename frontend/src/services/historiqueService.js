import api from './api';

export const historiqueService = {
  getByDossier: (dossierId) => {
    return api.get(`/historiques/dossier/${dossierId}`)
      .then(response => response.data);
  },

  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return api.get(`/historiques?${params}`)
      .then(response => response.data);
  }
};