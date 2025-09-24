import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Promotion } from '../types';
import { Building2, MapPin, Calendar, Users, DollarSign, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import PromotionFormModal from '../components/PromotionFormModal';
import toast from 'react-hot-toast';

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
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
          commercial:users(full_name)
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
      toast.error('Error inesperado');
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
    setShowPromotionModal(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setModalMode('edit');
    setShowPromotionModal(true);
  };

  const handleDeletePromotion = async (promotion: Promotion) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la promoción "${promotion.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotion.id);

      if (error) {
        console.error('Error deleting promotion:', error);
        if (error.code === '23503') {
          toast.error('No se puede eliminar la promoción porque tiene propiedades asociadas');
        } else {
          toast.error('Error al eliminar la promoción: ' + error.message);
        }
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
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
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
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando promociones...</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión de promociones inmobiliarias ({filteredPromotions.length} promociones)
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
                placeholder="Buscar por nombre, ubicación o promotor..."
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
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
              <option value="completed">Completadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de promociones */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promoción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comercial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comisión
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {promotion.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {promotion.phase} • {promotion.promotor}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {promotion.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                      {getStatusText(promotion.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {promotion.commercial?.full_name || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div>Inicio: {new Date(promotion.start_date).toLocaleDateString('es-ES')}</div>
                        {promotion.end_date && (
                          <div className="text-gray-500">Fin: {new Date(promotion.end_date).toLocaleDateString('es-ES')}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      {promotion.commission_percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditPromotion(promotion)}
                        className="text-green-600 hover:text-green-800 flex items-center"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePromotion(promotion)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de tarjetas para móvil (alternativa) */}
      <div className="md:hidden grid grid-cols-1 gap-6">
        {filteredPromotions.map((promotion) => (
          <div key={promotion.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{promotion.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {promotion.location} • {promotion.phase}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
                  {getStatusText(promotion.status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Inicio: {new Date(promotion.start_date).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Comercial: {promotion.commercial?.full_name || 'Sin asignar'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Comisión: {promotion.commission_percentage}%</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Promotor:</span> {promotion.promotor}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditPromotion(promotion)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeletePromotion(promotion)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPromotions.length === 0 && !loading && (
        <div className="bg-white shadow rounded-lg">
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay promociones</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron promociones con los filtros aplicados.'
                : 'Comienza creando una nueva promoción.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreatePromotion}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear primera promoción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario de promoción */}
      <PromotionFormModal
        isOpen={showPromotionModal}
        onClose={() => {
          setShowPromotionModal(false);
          setSelectedPromotion(null);
        }}
        onPromotionCreated={loadPromotions}
        promotion={selectedPromotion}
        mode={modalMode}
      />
    </div>
  );
};

export default Promotions;
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
    </div>
  );
};

export default Promotions;