import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Lock, Camera, Save } from 'lucide-react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    telephone: user?.telephone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.photo_profil) {
      setImagePreview(`http://localhost:5000/uploads/profiles/${user.photo_profil}`);
    } else {
      setImagePreview(null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = new FormData();
      updateData.append('telephone', formData.telephone);

      if (profileImage) {
        updateData.append('photo_profil', profileImage);
      }

      const response = await userService.updateProfile(updateData);
      updateUser(response.user);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await userService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Mot de passe changé avec succès');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Mon Profil</h1>
        <p className="profile-subtitle">Gérez vos informations personnelles</p>
      </div>

      <div className="profile-content">
        {/* Photo de profil */}
        <div className="profile-section">
          <h2 className="section-title">
            <User size={20} />
            Photo de profil
          </h2>
          <div className="profile-image-section">
            <div className="profile-image-container">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="image-upload">
              <label htmlFor="profile-image" className="image-upload-button">
                <Camera size={16} />
                Changer la photo
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="profile-section">
          <h2 className="section-title">
            <User size={20} />
            Informations personnelles
          </h2>
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                value={user?.prenom || ''}
                disabled
                className="form-input disabled"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nom</label>
              <input
                type="text"
                value={user?.nom || ''}
                disabled
                className="form-input disabled"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="form-input disabled"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              <Save size={16} />
              {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </button>
          </form>
        </div>

        {/* Changement de mot de passe */}
        <div className="profile-section">
          <h2 className="section-title">
            <Lock size={20} />
            Changer le mot de passe
          </h2>
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label className="form-label">Mot de passe actuel</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nouveau mot de passe</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="form-input"
                minLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                minLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              <Lock size={16} />
              {loading ? 'Changement...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
