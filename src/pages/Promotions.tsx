import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Promotion, UserProfile } from '../types';
import { Building2, MapPin, Calendar, Users, DollarSign, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PromotionFormModal from '../components/PromotionFormModal';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<(Promotion & { commercial?: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .select(`
          *,
          commercial:users!promotions_commercial_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading promotions:', error);
        toast.error('Error al cargar las promociones');
        return;
      }

      setPromotions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al cargar promociones');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePromotion = () => {
    setSelectedPromotion(null);
    setModalMode('create');
    setShowModal(true);
  };
  
  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setModalMode('edit');
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'inactive': return 'Inactiva';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  if (loading) {
    return <div>Cargando promociones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona todas las promociones inmobiliarias ({promotions.length} en total)
          </p>
        </div>
        <button
          onClick={handleCreatePromotion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Promoción
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900 truncate">{promotion.name}</h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                  {getStatusText(promotion.status)}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400" /> {promotion.location}</p>
                <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-400" /> {new Date(promotion.start_date).toLocaleDateString()}</p>
                <p className="flex items-center"><Users className="h-4 w-4 mr-2 text-gray-400" /> {promotion.commercial?.full_name || 'Sin asignar'}</p>
                <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-gray-400" /> Comisión: {promotion.commission_percentage}%</p>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3">
               <button className="text-gray-500 hover:text-gray-700"><Eye className="h-5 w-5"/></button>
               <button onClick={() => handleEditPromotion(promotion)} className="text-gray-500 hover:text-blue-700"><Edit className="h-5 w-5"/></button>
               <button className="text-gray-500 hover:text-red-700"><Trash2 className="h-5 w-5"/></button>
            </div>
          </div>
        ))}
      </div>
      
      <PromotionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPromotionCreated={loadPromotions}
        promotion={selectedPromotion}
        mode={modalMode}
      />
    </div>
  );
};

export default Promotions;