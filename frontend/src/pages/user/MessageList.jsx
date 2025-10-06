import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import './MessageList.scss';


const MessageList = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showSendForm, setShowSendForm] = useState(false);
  const [formData, setFormData] = useState({
    destinataire_id: '',
    sujet: '',
    contenu: ''
  });

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await messageService.getMyMessages();
      setMessages(response.messages);
    } catch (error) {
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getForMessaging();
      setUsers(response);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!formData.destinataire_id || !formData.contenu) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await messageService.send(formData);
      toast.success('Message envoyé avec succès');
      setFormData({ destinataire_id: '', sujet: '', contenu: '' });
      setShowSendForm(false);
      fetchMessages(); // Refresh messages
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700 flex items-center space-x-3">
            <MessageSquare size={32} />
            <span>Messages</span>
          </h1>
          <button
            onClick={() => setShowSendForm(!showSendForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Send size={16} />
            <span>Nouveau message</span>
          </button>
        </div>

        {showSendForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Envoyer un message</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire *
                </label>
                <select
                  name="destinataire_id"
                  value={formData.destinataire_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Sélectionner un destinataire</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.nom} {u.prenom} ({u.fonction})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet (optionnel)
                </label>
                <input
                  type="text"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Envoyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
        {messages.length === 0 ? (
          <div className="text-center text-green-500">
            Aucun message disponible.
          </div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-600">
                      {msg.expediteur_id === user.id ? 'À' : 'De'} {msg.exp_nom} {msg.exp_prenom}
                    </p>
                    {msg.sujet && <p className="font-medium text-gray-800">{msg.sujet}</p>}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${msg.lu ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                    {msg.lu ? 'Lu' : 'Non lu'}
                  </span>
                </div>
                <p className="text-gray-800">{msg.contenu}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.created_at).toLocaleString('fr-FR')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessageList;
