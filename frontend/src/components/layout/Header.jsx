import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  X,
  Settings
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { messageService } from '../../services/messageService';
import './Header.scss';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const notifResponse = await notificationService.getUnreadCount();
        const messageResponse = await messageService.getUnreadCount();
        setUnreadNotifications(notifResponse.count);
        setUnreadMessages(messageResponse.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Rafraîchir toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'admin': 'Administrateur',
      'user_accueil': 'Agent Accueil',
      'user_standard': 'Agent Standard'
    };
    return roles[role] || role;
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__bar">
          {/* Logo et nom de l'application */}
          <div className="header__logo-section">
            <Link to="/" className="header__logo-link">
              <div className="header__logo-icon">
                <span>SG</span>
              </div>
              <span className="header__logo-text">
                SGED Mahajanga
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <nav className="header__nav">
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="header__nav-link">
                  Tableau de Bord
                </Link>
                <Link to="/admin/users" className="header__nav-link">
                  Utilisateurs
                </Link>
                <Link to="/admin/circuits" className="header__nav-link">
                  Circuits
                </Link>
                <Link to="/admin/statistiques" className="header__nav-link">
                  Statistiques
                </Link>
              </>
            )}
            {(user?.role === 'user_accueil' || user?.role === 'user_standard') && (
              <>
                <Link to="/user/dashboard" className="header__nav-link">
                  Tableau de Bord
                </Link>
                <Link to="/user/dossiers" className="header__nav-link">
                  Dossiers
                </Link>
                <Link to="/user/circuits" className="header__nav-link">
                  Circuits
                </Link>
                <Link to="/user/messages" className="header__nav-link">
                  Messages
                </Link>
              </>
            )}
          </nav>

          {/* Actions utilisateur */}
          <div className="header__actions">
            {/* Notifications */}
            <Link 
              to="/notifications" 
              className="header__notification-link"
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="header__badge">
                  {unreadNotifications}
                </span>
              )}
            </Link>

            {/* Messages */}
            <Link 
              to="/messages" 
              className="header__notification-link"
            >
              <MessageSquare size={20} />
              {unreadMessages > 0 && (
                <span className="header__badge">
                  {unreadMessages}
                </span>
              )}
            </Link>

            {/* Menu utilisateur */}
            <div className="header__user-menu">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="header__user-button"
              >
                <div className="header__user-avatar">
                  <User size={16} />
                </div>
                <div className="header__user-info">
                  <div className="header__user-name">
                    {user?.prenom} {user?.nom}
                  </div>
                  <div className="header__user-role">
                    {getRoleDisplay(user?.role)}
                  </div>
                </div>
              </button>

              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="header__dropdown">
                  <Link
                    to="/user/profile"
                    className="header__dropdown-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    Mon Profil
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/settings"
                      className="header__dropdown-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Paramètres
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="header__dropdown-button header__dropdown-button--logout"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Menu mobile toggle */}
            <button
              className="header__mobile-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="header__mobile-menu">
            <nav className="header__mobile-nav">
              {user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de Bord
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Utilisateurs
                  </Link>
                  <Link 
                    to="/admin/circuits" 
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Circuits
                  </Link>
                  <Link 
                    to="/admin/statistiques" 
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Statistiques
                  </Link>
                </>
              )}
              {(user?.role === 'user_accueil' || user?.role === 'user_standard') && (
                <>
                  <Link
                    to="/user/dashboard"
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de Bord
                  </Link>
                  <Link
                    to="/user/dossiers"
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dossiers
                  </Link>
                  <Link
                    to="/user/circuits"
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Circuits
                  </Link>
                  <Link
                    to="/user/messages"
                    className="header__mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;