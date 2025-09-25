import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Promotion, UserProfile } from '../types';
import { Building2, MapPin, Calendar, Users, DollarSign, Plus, Eye, CreditCard as Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import PromotionFormModal from '../components/PromotionFormModal';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<(Promotion & { commercial?: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = 
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.promotor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
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

  const handleDeletePromotion = async (promotion: Promotion) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la promoción "${promotion.name}"?`)) {
      return;
    }

    try {
      // Verificar si hay propiedades asociadas
      const { count, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('promotion_id', promotion.id);

      if (countError) {
        console.error('Error checking properties:', countError);
        toast.error('Error al verificar las propiedades');
        return;
      }

      if (count && count > 0) {
        toast.error(`No se puede eliminar la promoción porque tiene ${count} propiedades asociadas`);
        return;
      }

      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotion.id);

      if (error) {
        console.error('Error deleting promotion:', error);
        toast.error('Error al eliminar la promoción: ' + error.message);
        return;
      }

      toast.success('Promoción eliminada correctamente');
      loadPromotions();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al eliminar la promoción');
    }
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
            Gestiona todas las promociones inmobiliarias ({filteredPromotions.length} promociones)
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

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar promociones por nombre, ubicación o promotor..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
              <option value="completed">Completada</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion) => (
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
               <button onClick={() => handleDeletePromotion(promotion)} className="text-gray-500 hover:text-red-700"><Trash2 className="h-5 w-5"/></button>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay promociones</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron promociones con los filtros aplicados.'
              : 'Comienza creando una nueva promoción.'
            }
          </p>
        </div>
      )}
      
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