import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Folder,
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { dossierService } from '../../services/dossierService';
import toast from 'react-hot-toast';

const DossierSearch = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Veuillez saisir un terme de recherche');
      return;
    }

    setLoading(true);
    try {
      const response = await dossierService.search(searchTerm);
      setSearchResults(response.dossiers);
      setSearched(true);
    } catch (error) {
      toast.error('Erreur lors de la recherche');
      setSearchResults([]);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Recherche de Dossiers</h1>
      </div>

      {/* Formulaire de recherche */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par numéro de dossier, type ou nom de circuit..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search size={20} />
            )}
            <span>Rechercher</span>
          </button>
        </form>
      </div>

      {/* Résultats de recherche */}
      {searched && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Résultats de recherche ({searchResults.length})
            </h2>
          </div>

          {searchResults.length > 0 ? (
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
                      Utilisateur
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
                  {searchResults.map((dossier) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dossier.user_nom && dossier.user_prenom ? (
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            {dossier.user_prenom} {dossier.user_nom}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={user?.role === 'admin' ? `/admin/dossiers/${dossier.id}` : `/user/dossiers/${dossier.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir le dossier"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun résultat trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos termes de recherche.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DossierSearch;
