import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Folder,
  Search,
  Plus,
  Eye,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  CheckSquare
} from 'lucide-react';
import { dossierService } from '../../services/dossierService';
import { mouvementService } from '../../services/mouvementService';
import toast from 'react-hot-toast';
import './DossierList.scss';


const DossierList = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await dossierService.getMyDossiers();
      setDossiers(response.dossiers);
    } catch (error) {
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  };

  const handleSortir = async (dossierId, observations = '') => {
    try {
      await dossierService.sortir(dossierId, observations);
      toast.success('Dossier sorti avec succès');
      fetchDossiers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sortie du dossier');
    }
  };

  const handleArriver = async (dossierId) => {
    try {
      await mouvementService.arriver(dossierId, 'Dossier arrivé pour traitement');
      toast.success('Arrivée du dossier enregistrée');
      fetchDossiers();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de l\'arrivée');
    }
  };

  const handleTraiter = async (dossierId, observations = '') => {
    try {
      await dossierService.traiter(dossierId, observations);
      toast.success('Dossier traité avec succès');
      fetchDossiers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du traitement du dossier');
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'en_attente': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'en_cours': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'traite': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'traite': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDossiers = dossiers.filter(dossier =>
    dossier.numero_dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.type_dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.circuit_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(dossier => 
    selectedStatut ? dossier.statut === selectedStatut : true
  );

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
        <h1 className="text-3xl font-bold text-gray-900">Mes Dossiers</h1>
        {user?.role === 'user_accueil' && (
          <Link
            to="/user/dossiers/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nouveau Dossier</span>
          </Link>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedStatut}
            onChange={(e) => setSelectedStatut(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="traite">Traité</option>
          </select>
        </div>
      </div>

      {/* Liste des dossiers */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dossier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Circuit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDossiers.map((dossier) => (
                <tr key={dossier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Folder className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {dossier.numero_dossier}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {dossier.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dossier.type_dossier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dossier.circuit_nom || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(dossier.statut)}`}>
                      {getStatutIcon(dossier.statut)}
                      <span className="ml-1 capitalize">
                        {dossier.statut.replace('_', ' ')}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={`/user/dossiers/${dossier.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir le dossier"
                      >
                        <Eye size={16} />
                      </a>
                      
                      {user?.role === 'user_accueil' && dossier.statut === 'en_attente' && (
                        <button
                          onClick={() => handleSortir(dossier.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Sortir le dossier"
                        >
                          <LogOut size={16} />
                        </button>
                      )}
                      
                      {user?.role === 'user_standard' && dossier.statut === 'en_cours' && (
                        <button
                          onClick={() => handleArriver(dossier.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Enregistrer l'arrivée"
                        >
                          Arrivée
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDossiers.length === 0 && (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedStatut 
                ? 'Essayez de modifier vos critères de recherche.' 
                : 'Commencez par créer un nouveau dossier.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DossierList;