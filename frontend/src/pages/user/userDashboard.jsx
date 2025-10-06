import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Folder,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search
} from 'lucide-react';
import { dossierService } from '../../services/dossierService';
import { mouvementService } from '../../services/mouvementService';
import toast from 'react-hot-toast';
import './userDashboard.scss';


const UserDashboard = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [stats, setStats] = useState({
    en_attente: 0,
    en_cours: 0,
    traite: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await dossierService.getMyDossiers();
      setDossiers(response.dossiers);
      
      // Calcul des statistiques
      const stats = {
        en_attente: response.dossiers.filter(d => d.statut === 'en_attente').length,
        en_cours: response.dossiers.filter(d => d.statut === 'en_cours').length,
        traite: response.dossiers.filter(d => d.statut === 'traite').length
      };
      setStats(stats);
    } catch (error) {
      toast.error('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
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

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'en_attente': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'en_cours': return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'traite': return <CheckCircle className="h-5 w-5 text-green-500" />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
                <p className="text-blue-100 text-lg">
                  Bienvenue, {user?.prenom} {user?.nom}
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-medium">{user?.role === 'user_accueil' ? 'Agent Accueil' : 'Agent Standard'}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-medium">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              {user?.role === 'user_accueil' && (
                <a
                  href="/user/dossiers/create"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  <span className="font-semibold">Nouveau Dossier</span>
                </a>
              )}
            </div>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        En attente
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.en_attente}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        En cours
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.en_cours}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Traités
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.traite}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dossiers récents */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Dossiers Récents
              </h3>

              <div className="space-y-4">
                {dossiers.slice(0, 5).map((dossier) => (
                  <div key={dossier.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Folder className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {dossier.numero_dossier}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {dossier.type_dossier} • {dossier.circuit_nom}
                          </p>
                          <p className="text-xs text-gray-400">
                            Créé le {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(dossier.statut)}`}>
                          {getStatutIcon(dossier.statut)}
                          <span className="ml-1 capitalize">
                            {dossier.statut.replace('_', ' ')}
                          </span>
                        </span>

                        {user?.role === 'user_standard' && dossier.statut === 'en_cours' && (
                          <button
                            onClick={() => handleArriver(dossier.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Arrivée
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {dossiers.length === 0 && (
                  <div className="text-center py-8">
                    <Folder className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Commencez par créer un nouveau dossier.
                    </p>
                  </div>
                )}
              </div>

              {dossiers.length > 5 && (
                <div className="mt-4 text-center">
                  <a
                    href="/user/dossiers"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Voir tous les dossiers →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;