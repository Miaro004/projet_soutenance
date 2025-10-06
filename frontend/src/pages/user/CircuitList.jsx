import React, { useState, useEffect } from 'react';
import { circuitService } from '../../services/circuitService';
import { Eye, Users, MapPin } from 'lucide-react';

const CircuitList = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      const data = await circuitService.getAllCircuits();
      setCircuits(data);
    } catch (error) {
      console.error('Erreur lors du chargement des circuits');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Circuits de Validation</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {circuits.map((circuit) => (
          <div key={circuit.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{circuit.nom}</h3>
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{circuit.nombre_bornes} bornes</span>
                </div>

                <div className="text-sm text-gray-500">
                  Circuit de validation pour les dossiers
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                  <Eye size={16} />
                  <span>Voir les détails</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {circuits.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun circuit trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Les circuits de validation seront affichés ici.
          </p>
        </div>
      )}
    </div>
  );
};

export default CircuitList;
