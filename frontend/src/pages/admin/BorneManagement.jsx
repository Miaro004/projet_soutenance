import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { borneService } from '../../services/borneService';
import { circuitService } from '../../services/circuitService';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const BorneManagement = () => {
  const { circuitId } = useParams();
  const navigate = useNavigate();

  const [circuit, setCircuit] = useState(null);
  const [bornes, setBornes] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    rang: '',
    user_id: '',
    conditions: ''
  });

  useEffect(() => {
    // Fetch circuit details
    circuitService.getById(circuitId)
      .then(data => setCircuit(data.circuit))
      .catch(() => toast.error('Erreur lors du chargement du circuit'));

    // Fetch bornes for this circuit
    borneService.getByCircuit(circuitId)
      .then(data => setBornes(data.bornes))
      .catch(() => toast.error('Erreur lors du chargement des bornes'));

    // Fetch users to assign
    userService.getAll()
      .then(data => setUsers(data.users))
      .catch(() => toast.error('Erreur lors du chargement des utilisateurs'));
  }, [circuitId]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rang || !formData.user_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      await borneService.create({
        circuit_id: circuitId,
        rang: parseInt(formData.rang),
        user_id: parseInt(formData.user_id),
        conditions: formData.conditions
      });
      toast.success('Borne créée avec succès');
      // Refresh bornes list
      const data = await borneService.getByCircuit(circuitId);
      setBornes(data.bornes);
      setFormData({ rang: '', user_id: '', conditions: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la borne');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Bornes pour le circuit: {circuit?.nom}</h2>

      <form onSubmit={handleSubmit} className="mb-6 max-w-md">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Rang (1 à {circuit?.nombre_bornes}) *</label>
          <input
            type="number"
            name="rang"
            min="1"
            max={circuit?.nombre_bornes}
            value={formData.rang}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Utilisateur assigné *</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Sélectionnez un utilisateur</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.nom} {user.prenom} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Conditions (optionnel)</label>
          <textarea
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter la borne
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Bornes existantes</h3>
      {bornes.length === 0 ? (
        <p>Aucune borne trouvée pour ce circuit.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-1">Rang</th>
              <th className="border border-gray-300 px-3 py-1">Utilisateur</th>
              <th className="border border-gray-300 px-3 py-1">Conditions</th>
            </tr>
          </thead>
          <tbody>
            {bornes.map(borne => (
              <tr key={borne.id}>
                <td className="border border-gray-300 px-3 py-1">{borne.rang}</td>
                <td className="border border-gray-300 px-3 py-1">{borne.fonction}</td>
                <td className="border border-gray-300 px-3 py-1">{borne.conditions || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate('/admin/circuits')}
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Retour à la gestion des circuits
      </button>
    </div>
  );
};

export default BorneManagement;
