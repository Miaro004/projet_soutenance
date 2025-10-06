import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Folder, 
  CircuitBoard, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { userService } from '../../services/userService';
import { dossierService } from '../../services/dossierService';
import { circuitService } from '../../services/circuitService';
import './Dashboard.scss';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    dossiers: 0,
    circuits: 0,
    dossierStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResponse, dossiersResponse, circuitsResponse] = await Promise.all([
          userService.getStats(),
          dossierService.getStats(),
          circuitService.getAll()
        ]);

        setStats({
          users: usersResponse.stats.reduce((acc, stat) => acc + stat.count, 0),
          dossiers: dossiersResponse.stats.reduce((acc, stat) => acc + stat.count, 0),
          circuits: circuitsResponse.circuits.length,
          dossierStats: dossiersResponse.stats
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatutClass = (statut) => {
    switch (statut) {
      case 'en_attente': return 'dashboard__dossier-stat--en-attente';
      case 'en_cours': return 'dashboard__dossier-stat--en-cours';
      case 'traite': return 'dashboard__dossier-stat--traite';
      default: return 'dashboard__dossier-stat--default';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'en_attente': return <Clock className="h-5 w-5" />;
      case 'en_cours': return <AlertCircle className="h-5 w-5" />;
      case 'traite': return <CheckCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="dashboard__loader">
        <div className="dashboard__spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Tableau de Bord Administrateur</h1>
      </div>

      {/* Cartes de statistiques */}
      <div className="dashboard__stats-grid">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-inner">
              <div className="dashboard__stat-icon">
                <Users />
              </div>
              <div className="dashboard__stat-details">
                <dt className="dashboard__stat-label">
                  Utilisateurs
                </dt>
                <dd className="dashboard__stat-value">
                  {stats.users}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-inner">
              <div className="dashboard__stat-icon">
                <Folder />
              </div>
              <div className="dashboard__stat-details">
                <dt className="dashboard__stat-label">
                  Dossiers
                </dt>
                <dd className="dashboard__stat-value">
                  {stats.dossiers}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-inner">
              <div className="dashboard__stat-icon">
                <CircuitBoard />
              </div>
              <div className="dashboard__stat-details">
                <dt className="dashboard__stat-label">
                  Circuits
                </dt>
                <dd className="dashboard__stat-value">
                  {stats.circuits}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des dossiers par statut */}
      <div className="dashboard__section">
        <div className="dashboard__section-content">
          <h3 className="dashboard__section-title">
            Statistiques des Dossiers
          </h3>
          <div className="dashboard__dossier-grid">
            {stats.dossierStats.map((stat) => (
              <div
                key={stat.statut}
                className={`dashboard__dossier-stat ${getStatutClass(stat.statut)}`}
              >
                <div className="dashboard__dossier-icon">
                  {getStatutIcon(stat.statut)}
                </div>
                <div className="dashboard__dossier-info">
                  <p className="dashboard__dossier-label">
                    {stat.statut.replace('_', ' ')}
                  </p>
                  <p className="dashboard__dossier-count">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="dashboard__section">
        <div className="dashboard__section-content">
          <h3 className="dashboard__section-title">
            Actions Rapides
          </h3>
          <div className="dashboard__actions-grid">
            <a href="/admin/users" className="dashboard__action-card">
              <div className="dashboard__action-icon">
                <Users />
              </div>
              <h4 className="dashboard__action-title">Gérer les Utilisateurs</h4>
              <p className="dashboard__action-description">
                Ajouter, modifier des utilisateurs
              </p>
            </a>

            <a href="/admin/circuits" className="dashboard__action-card">
              <div className="dashboard__action-icon">
                <CircuitBoard />
              </div>
              <h4 className="dashboard__action-title">Gérer les Circuits</h4>
              <p className="dashboard__action-description">
                Configurer les circuits de traitement
              </p>
            </a>

            <a href="/admin/dossiers" className="dashboard__action-card">
              <div className="dashboard__action-icon">
                <Folder />
              </div>
              <h4 className="dashboard__action-title">Voir les Dossiers</h4>
              <p className="dashboard__action-description">
                Consulter tous les dossiers
              </p>
            </a>

            <a href="/admin/statistiques" className="dashboard__action-card">
              <div className="dashboard__action-icon">
                <TrendingUp />
              </div>
              <h4 className="dashboard__action-title">Statistiques Détaillées</h4>
              <p className="dashboard__action-description">
                Analyses et rapports
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;