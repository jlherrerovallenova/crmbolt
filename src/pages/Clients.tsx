import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Client } from '../types';
import { Users, Phone, Mail, MapPin, CreditCard, Search, Eye, Plus } from 'lucide-react';
import ClientFormModal from '../components/ClientFormModal';
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState<string>('all');
  const [showClientModal, setShowClientModal] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
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
          onClick={() => setShowClientModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
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
      <div className="grid grid-cols-1 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {client.first_name} {client.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">DNI: {client.dni}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaritalStatusColor(client.marital_status)}`}>
                  {getMaritalStatusText(client.marital_status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.phone_1}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{client.email_1}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.municipality}, {client.province}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">***{client.bank_account.slice(-4)}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Dirección:</span> {client.address}, {client.postal_code} {client.municipality}
                </p>
              </div>

              {client.observations && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Observaciones:</span> {client.observations}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Registrado: {new Date(client.created_at!).toLocaleDateString('es-ES')}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver detalles
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || maritalStatusFilter !== 'all'
              ? 'No se encontraron clientes con los filtros aplicados.'
              : 'Comienza agregando un nuevo cliente.'
            }
          </p>
        </div>
      )}

      {/* Modal de nuevo cliente */}
      <ClientFormModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientCreated={loadClients}
      />
    </div>
  );
};

export default Clients;