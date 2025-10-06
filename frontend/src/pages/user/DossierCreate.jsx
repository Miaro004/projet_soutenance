import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dossierService } from '../../services/dossierService';
import { circuitService } from '../../services/circuitService';
import toast from 'react-hot-toast';
import './DossierCreate.scss';


const DossierCreate = () => {
  const [formData, setFormData] = useState({
    numero_dossier: '',
    type_dossier: '',
    circuit_id: '',
    description: '',
    documents: []
  });
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCircuits();
  }, []);

  const loadCircuits = async () => {
    try {
      const data = await circuitService.getAll();
      setCircuits(data.circuits);
    } catch (error) {
      toast.error('Erreur lors du chargement des circuits');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documents: Array.from(e.target.files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dossierData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          formData.documents.forEach(file => {
            dossierData.append('documents', file);
          });
        } else {
          dossierData.append(key, formData[key]);
        }
      });

      await dossierService.create(dossierData);
      toast.success('Dossier créé avec succès');
      navigate('/user/dossiers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du dossier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau dossier</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro du dossier
              </label>
              <input
                type="text"
                name="numero_dossier"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.numero_dossier}
                onChange={handleChange}
                placeholder="DOS-2024001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de dossier
              </label>
              <select
                name="type_dossier"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type_dossier}
                onChange={handleChange}
              >
                <option value="">Sélectionner un type</option>
                <option value="administratif">Administratif</option>
                <option value="juridique">Juridique</option>
                <option value="financier">Financier</option>
                <option value="technique">Technique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Circuit de validation
            </label>
            <select
              name="circuit_id"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.circuit_id}
              onChange={handleChange}
            >
              <option value="">Sélectionner un circuit</option>
              {circuits.map(circuit => (
                <option key={circuit.id} value={circuit.id}>
                  {circuit.nom} ({circuit.nombre_bornes} bornes)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée du dossier..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documents joints
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Formats acceptés: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/user/dossiers')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DossierCreate;
