import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import './Register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'user_standard',
    fonction: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <h1 className="logo-text">SGDE</h1>
          </div>
          <h2 className="title">Créer un nouveau compte</h2>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Adresse e-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Nouveau mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fonction">Fonction</label>
            <input
              id="fonction"
              name="fonction"
              type="text"
              required
              placeholder="Fonction"
              value={formData.fonction}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telephone">Téléphone</label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              placeholder="Téléphone (facultatif)"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>

          <p className="terms-text">
            En cliquant sur Inscription, vous acceptez nos{' '}
            <a href="#">Conditions générales</a>,{' '}
            notre <a href="#">Politique d'utilisation des données</a> et{' '}
            notre <a href="#">Politique de cookies</a>.
          </p>

          <div className="button-container">
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Inscription...' : 'Inscription'}
            </button>
          </div>
        </form>

        <div className="login-link">
          <Link to="/login">Vous avez déjà un compte ?</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;