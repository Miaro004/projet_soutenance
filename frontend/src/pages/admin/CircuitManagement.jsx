import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  CircuitBoard as CircuitIcon,
  Users,
  MoreVertical
} from 'lucide-react';
import { circuitService } from '../../services/circuitService';
import { borneService } from '../../services/borneService';
import toast from 'react-hot-toast';

const CircuitManagement = () => {
  const navigate = useNavigate();
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    nombre_bornes: 2
  });

  useEffect(() => {
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      const response = await circuitService.getAll();
      setCircuits(response.circuits);
    } catch (error) {
      toast.error('Erreur lors du chargement des circuits');
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCircuit) {
        await circuitService.update(editingCircuit.id, formData);
        toast.success('Circuit modifié avec succès');
      } else {
        await circuitService.create(formData);
        toast.success('Circuit créé avec succès');
      }
      setShowModal(false);
      resetForm();
      fetchCircuits();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (circuit) => {
    setEditingCircuit(circuit);
    setFormData({
      nom: circuit.nom,
      description: circuit.description || '',
      nombre_bornes: circuit.nombre_bornes
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver ce circuit ?')) {
      try {
        await circuitService.delete(id);
        toast.success('Circuit désactivé avec succès');
        fetchCircuits();
      } catch (error) {
        toast.error('Erreur lors de la désactivation');
      }
    }
  };

  const handleViewBornes = (circuit) => {
    navigate(`/admin/circuits/${circuit.id}/bornes`);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      nombre_bornes: 2
    });
    setEditingCircuit(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Circuits</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouveau Circuit</span>
        </button>
      </div>

      {/* Liste des circuits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circuits.map((circuit) => (
          <div key={circuit.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CircuitIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{circuit.nom}</h3>
                    <p className="text-sm text-gray-500">{circuit.nombre_bornes} bornes</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {circuit.description && (
                <p className="text-gray-600 text-sm mb-4">{circuit.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Créé par {circuit.createur_prenom} {circuit.createur_nom}</span>
                <span className={circuit.is_active ? 'text-green-600' : 'text-red-600'}>
                  {circuit.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewBornes(circuit)}
                  className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center space-x-1"
                >
                  <Users size={14} />
                  <span>Voir les bornes</span>
                </button>
                <button
                  onClick={() => handleEdit(circuit)}
                  className="px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(circuit.id)}
                  className="px-3 py-2 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal circuit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingCircuit ? 'Modifier le circuit' : 'Nouveau Circuit'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom du circuit</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de bornes</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.nombre_bornes}
                  onChange={(e) => setFormData({...formData, nombre_bornes: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingCircuit ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default CircuitManagement;