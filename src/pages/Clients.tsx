import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Client } from '../types';
import { Users, Phone, Mail, MapPin, CreditCard, Search, Eye, Plus, Edit, Trash2, Home } from 'lucide-react';
import ClientFormModal from '../components/ClientFormModal';
import ClientDetailsModal from '../components/ClientDetailsModal';
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState<string>('all');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [clientProperties, setClientProperties] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar clientes
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading clients:', error);
        toast.error('Error al cargar los clientes');
        return;
      }

      setClients(data || []);

      // Cargar número de propiedades por cliente
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_clients')
        .select('client_id');

      if (!propertyError && propertyData) {
        const propertyCounts = propertyData.reduce((acc: { [key: string]: number }, item) => {
          acc[item.client_id] = (acc[item.client_id] || 0) + 1;
          return acc;
        }, {});
        setClientProperties(propertyCounts);
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setModalMode('create');
    setShowClientModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setShowClientModal(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al cliente ${client.first_name} ${client.last_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);

      if (error) {
        console.error('Error deleting client:', error);
        if (error.code === '23503') {
          toast.error('No se puede eliminar el cliente porque tiene propiedades asignadas');
        } else {
          toast.error('Error al eliminar el cliente: ' + error.message);
        }
        return;
      }

      toast.success('Cliente eliminado correctamente');
      loadData();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al eliminar el cliente');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email_1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMaritalStatus = maritalStatusFilter === 'all' || client.marital_status === maritalStatusFilter;
    
    return matchesSearch && matchesMaritalStatus;
  });

  const getMaritalStatusText = (status: string) => {
    switch (status) {
      case 'single': return 'Soltero/a';
      case 'married': return 'Casado/a'; // Mantener compatibilidad
      case 'married_community': return 'Casado/a en gananciales';
      case 'married_separation': return 'Casado/a en separación de bienes';
      case 'domestic_partnership': return 'Pareja de hecho';
      case 'divorced': return 'Divorciado/a';
      case 'widowed': return 'Viudo/a';
      default: return status;
    }
  };

  const getMaritalStatusColor = (status: string) => {
    switch (status) {
      case 'single': return 'bg-blue-100 text-blue-800';
      case 'married': return 'bg-green-100 text-green-800'; // Mantener compatibilidad
      case 'married_community': return 'bg-green-100 text-green-800';
      case 'married_separation': return 'bg-green-200 text-green-900';
      case 'domestic_partnership': return 'bg-purple-100 text-purple-800';
      case 'divorced': return 'bg-yellow-100 text-yellow-800';
      case 'widowed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando clientes...</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión de clientes y compradores ({filteredClients.length} clientes)
          </p>
        </div>
        <button 
          onClick={handleCreateClient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Cliente
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
                placeholder="Buscar clientes por nombre, DNI, email o ciudad..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={maritalStatusFilter}
              onChange={(e) => setMaritalStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="single">Soltero/a</option>
              <option value="married">Casado/a</option> {/* Mantener compatibilidad */}
              <option value="married_community">Casado/a en gananciales</option>
              <option value="married_separation">Casado/a en separación de bienes</option>
              <option value="domestic_partnership">Pareja de hecho</option>
              <option value="divorced">Divorciado/a</option>
              <option value="widowed">Viudo/a</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Civil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propiedades
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          DNI: {client.dni}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {client.phone_1}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="truncate max-w-xs">{client.email_1}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {client.municipality}, {client.province}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaritalStatusColor(client.marital_status)}`}>
                      {getMaritalStatusText(client.marital_status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Home className="h-4 w-4 mr-1 text-gray-400" />
                      {clientProperties[client.id] || 0} propiedades
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewClient(client)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="text-green-600 hover:text-green-800 flex items-center"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client)}
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

      {/* Mensaje cuando no hay clientes */}
      {filteredClients.length === 0 && !loading && (
        <div className="bg-white shadow rounded-lg">
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || maritalStatusFilter !== 'all'
                ? 'No se encontraron clientes con los filtros aplicados.'
                : 'Comienza agregando un nuevo cliente.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateClient}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir primer cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario de cliente */}
      <ClientFormModal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setSelectedClient(null);
        }}
        onClientCreated={loadData}
        client={selectedClient}
        mode={modalMode}
      />

      {/* Modal de detalles del cliente */}
      <ClientDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
    </div>
  );
};

export default Clients;