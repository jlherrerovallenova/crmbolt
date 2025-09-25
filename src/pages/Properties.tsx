import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property, Promotion } from '../types';
import { Home, Building2, MapPin, Bed, Square, Euro, Search, Filter, Eye, Plus, CreditCard as Edit, Trash2, Upload } from 'lucide-react';
import PropertyFormModal from '../components/PropertyFormModal';
import toast from 'react-hot-toast';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionFilter, setPromotionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load properties with promotion info
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          promotion:promotions(name, location),
          commercial:users!properties_commercial_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Error loading properties:', propertiesError);
        toast.error('Error al cargar las viviendas');
        return;
      }

      // Load promotions for filter
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('id, name')
        .order('name');

      if (promotionsError) {
        console.error('Error loading promotions:', promotionsError);
      }

      setProperties(propertiesData || []);
      setPromotions(promotionsData || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.promotion?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.promotion?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${property.floor}${property.letter}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPromotion = promotionFilter === 'all' || property.promotion_id === promotionFilter;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    
    return matchesSearch && matchesPromotion && matchesStatus;
  });

  const handleCreateProperty = () => {
    setSelectedProperty(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteProperty = async (property: Property) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la vivienda ${property.floor}º${property.letter}?`)) {
      return;
    }

    try {
      // Check if property has assigned clients
      const { count, error: countError } = await supabase
        .from('property_clients')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', property.id);

      if (countError) {
        console.error('Error checking property clients:', countError);
        toast.error('Error al verificar los compradores');
        return;
      }

      if (count && count > 0) {
        toast.error(`No se puede eliminar la vivienda porque tiene ${count} comprador${count > 1 ? 'es' : ''} asignado${count > 1 ? 's' : ''}`);
        return;
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) {
        console.error('Error deleting property:', error);
        toast.error('Error al eliminar la vivienda: ' + error.message);
        return;
      }

      toast.success('Vivienda eliminada correctamente');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al eliminar la vivienda');
    }
  };

  const handleImportCSV = () => {
    toast.info('Funcionalidad no implementada');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'contract_signed': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      case 'deed_signed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Disponible';
      case 'reserved': return 'Reservada';
      case 'contract_signed': return 'Contrato firmado';
      case 'sold': return 'Vendida';
      case 'deed_signed': return 'Escriturada';
      default: return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viviendas</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando viviendas...</p>
        </div>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Viviendas</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión de viviendas y propiedades ({filteredProperties.length} viviendas)
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleImportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </button>
          <button
            onClick={handleCreateProperty}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Vivienda
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar viviendas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={promotionFilter}
              onChange={(e) => setPromotionFilter(e.target.value)}
            >
              <option value="all">Todas las promociones</option>
              {promotions.map((promotion) => (
                <option key={promotion.id} value={promotion.id}>
                  {promotion.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Disponible</option>
              <option value="reserved">Reservada</option>
              <option value="contract_signed">Contrato firmado</option>
              <option value="sold">Vendida</option>
              <option value="deed_signed">Escriturada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de viviendas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Home className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {property.floor}º{property.letter}
                  </h3>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {getStatusText(property.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{property.promotion?.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{property.promotion?.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Bed className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{property.bedrooms} dorm.</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Square className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{property.useful_surface}m²</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  <Euro className="h-5 w-5 mr-1 text-green-600" />
                  {formatPrice(property.final_price)}
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver detalles
                </button>
              </div>

              {property.observations && (
                <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {property.observations}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Ver detalles"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleEditProperty(property)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProperty(property)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay viviendas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || promotionFilter !== 'all' || statusFilter !== 'all'
              ? 'No se encontraron viviendas con los filtros aplicados.'
              : 'No hay viviendas registradas en el sistema.'
            }
          </p>
        </div>
      )}

      {/* Modal de formulario */}
      <PropertyFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPropertyCreated={loadData}
        property={selectedProperty}
        mode={modalMode}
      />
    </div>
  );
};

export default Properties;