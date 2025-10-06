import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import './UserManagement.scss';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'user_standard',
    fonction: '',
    telephone: '',
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.users);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
        toast.success('Utilisateur modifié avec succès');
      } else {
        await userService.create(formData);
        toast.success('Utilisateur créé avec succès');
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: '',
      role: user.role,
      fonction: user.fonction,
      telephone: user.telephone || '',
      is_active: user.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      try {
        await userService.delete(id);
        toast.success('Utilisateur désactivé avec succès');
        fetchUsers();
      } catch (error) {
        toast.error('Erreur lors de la désactivation');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'user_standard',
      fonction: '',
      telephone: '',
      is_active: true
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fonction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const roles = {
      'admin': { className: 'user-management__badge--admin', label: 'Admin' },
      'user_accueil': { className: 'user-management__badge--accueil', label: 'Accueil' },
      'user_standard': { className: 'user-management__badge--standard', label: 'Standard' }
    };
    const roleInfo = roles[role] || { className: 'user-management__badge--standard', label: role };
    
    return (
      <span className={`user-management__badge ${roleInfo.className}`}>
        {roleInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="user-management__loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="user-management__container">
      <div className="user-management__header">
        <h1>Gestion des Utilisateurs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="user-management__add-button"
        >
          <Plus size={20} />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="user-management__search-bar">
        <div className="search-wrapper">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="user-management__table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Fonction</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-management__user-cell">
                      <div className="user-avatar">
                        <Users />
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {getRoleBadge(user.role)}
                  </td>
                  <td>
                    <span className="user-management__text--sm">{user.fonction}</span>
                  </td>
                  <td>
                    <span className="user-management__text--gray">{user.telephone || '-'}</span>
                  </td>
                  <td>
                    {user.is_active ? (
                      <span className="user-management__badge user-management__badge--active">
                        <UserCheck size={12} />
                        Actif
                      </span>
                    ) : (
                      <span className="user-management__badge user-management__badge--inactive">
                        <UserX size={12} />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="user-management__actions">
                      <button
                        onClick={() => handleEdit(user)}
                        className="edit-button"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="delete-button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="modal__overlay">
          <div className="modal__content">
            <h2>
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel Utilisateur'}
            </h2>
            
            <form onSubmit={handleSubmit} className="modal__form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user_standard">User Standard</option>
                  <option value="user_accueil">User Accueil</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fonction</label>
                <input
                  type="text"
                  required
                  value={formData.fonction}
                  onChange={(e) => setFormData({...formData, fonction: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                />
              </div>

              {editingUser && (
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    <span>Utilisateur actif</span>
                  </label>
                </div>
              )}

              <div className="modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="cancel-button"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="submit-button"
                >
                  {editingUser ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;