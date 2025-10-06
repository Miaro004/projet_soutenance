import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import toast from 'react-hot-toast';
import './NotificationList.scss';

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getMyNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 flex items-center space-x-3">
          <Bell size={32} />
          <span>Notifications</span>
        </h1>
        {notifications.length === 0 ? (
          <div className="text-center text-purple-500">
            Aucune notification disponible.
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li key={notif.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                <p className="text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notif.date).toLocaleString('fr-FR')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
