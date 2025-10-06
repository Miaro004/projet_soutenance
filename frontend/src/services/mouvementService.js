import api from './api';

export const mouvementService = {
  getByDossier: (dossierId) => {
    return api.get(`/mouvements/dossier/${dossierId}`)
      .then(response => response.data);
  },

  arriver: (dossierId, observations = '') => {
    return api.post(`/mouvements/${dossierId}/arriver`, { observations })
      .then(response => response.data);
  }
};