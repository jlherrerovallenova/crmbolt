import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, CreditCard, Heart, Home, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Client, Property } from '../types';
import toast from 'react-hot-toast';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

interface PropertyWithPromotion extends Property {
  promotion?: {
    name: string;
    location: string;
  };
}

interface PropertyClient {
  id: string;
  property_id: string;
  client_id: string;
  is_primary_buyer: boolean;
  property: PropertyWithPromotion;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ isOpen, onClose, client }) => {
  const [properties, setProperties] = useState<PropertyClient[]>([]);
  const [coOwners, setCoOwners] = useState<{ [key: string]: Client[] }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      loadClientProperties();
    }
  }, [isOpen, client]);

  const loadClientProperties = async () => {
    if (!client) return;

    try {
      setLoading(true);

      // Cargar propiedades del cliente
      const { data: propertyData, error: propertyError } = await supabase
        .from('property_clients')
        .select(`
          *,
          property:properties(
            *,
            promotion:promotions(name, location)
          )
        `)
        .eq('client_id', client.id);

      if (propertyError) {
        console.error('Error loading client properties:', propertyError);
        toast.error('Error al cargar las propiedades del cliente');
        return;
      }

      setProperties(propertyData || []);

      // Cargar cotitulares para cada propiedad
      const coOwnersData: { [key: string]: Client[] } = {};
      
      for (const propertyClient of propertyData || []) {
        const { data: otherOwners, error: ownersError } = await supabase
          .from('property_clients')
          .select(`
            client:clients(*)
          `)
          .eq('property_id', propertyClient.property_id)
          .neq('client_id', client.id);

        if (!ownersError && otherOwners) {
          coOwnersData[propertyClient.property_id] = otherOwners.map(o => o.client);
        }
      }

      setCoOwners(coOwnersData);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const getMaritalStatusText = (status: string) => {
    switch (status) {
      case 'single': return 'Soltero/a';
      case 'married': return 'Casado/a';
      case 'married_community': return 'Casado/a en gananciales';
      case 'married_separation': return 'Casado/a en separación de bienes';
      case 'domestic_partnership': return 'Pareja de hecho';
      case 'divorced': return 'Divorciado/a';
      case 'widowed': return 'Viudo/a';
      default: return status;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2 text-blue-600" />
            Detalles del Cliente
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del Cliente */}
          <div className="space-y-6">
            {/* Datos Personales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Nombre completo:</span>
                  <p className="text-gray-900">{client.first_name} {client.last_name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">DNI/NIE:</span>
                  <p className="text-gray-900">{client.dni}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    Estado civil:
                  </span>
                  <p className="text-gray-900">{getMaritalStatusText(client.marital_status)}</p>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Información de Contacto
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Email principal:</span>
                  <p className="text-gray-900">{client.email_1}</p>
                </div>
                {client.email_2 && (
                  <div>
                    <span className="font-medium text-gray-700">Email secundario:</span>
                    <p className="text-gray-900">{client.email_2}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Teléfono 1:</span>
                  <p className="text-gray-900">{client.phone_1}</p>
                </div>
                {client.phone_2 && (
                  <div>
                    <span className="font-medium text-gray-700">Teléfono 2:</span>
                    <p className="text-gray-900">{client.phone_2}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Dirección
              </h4>
              <div className="space-y-2">
                <p className="text-gray-900">{client.address}</p>
                <p className="text-gray-900">{client.postal_code} {client.municipality}</p>
                <p className="text-gray-900">{client.province}</p>
              </div>
            </div>

            {/* Información Bancaria */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Información Bancaria
              </h4>
              <div>
                <span className="font-medium text-gray-700">IBAN:</span>
                <p className="text-gray-900 font-mono">{client.bank_account}</p>
              </div>
            </div>

            {/* Observaciones */}
            {client.observations && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Observaciones</h4>
                <p className="text-gray-700">{client.observations}</p>
              </div>
            )}
          </div>

          {/* Propiedades del Cliente */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Propiedades ({properties.length})
              </h4>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : properties.length > 0 ? (
                <div className="space-y-4">
                  {properties.map((propertyClient) => (
                    <div key={propertyClient.id} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">
                          {propertyClient.property.floor}º{propertyClient.property.letter}
                        </h5>
                        <div className="flex items-center space-x-2">
                          {propertyClient.is_primary_buyer && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Comprador Principal
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(propertyClient.property.status)}`}>
                            {getStatusText(propertyClient.property.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Promoción:</span> {propertyClient.property.promotion?.name}</p>
                        <p><span className="font-medium">Ubicación:</span> {propertyClient.property.promotion?.location}</p>
                        <p><span className="font-medium">Dormitorios:</span> {propertyClient.property.bedrooms}</p>
                        <p><span className="font-medium">Superficie:</span> {propertyClient.property.useful_surface}m²</p>
                        <p><span className="font-medium">Precio:</span> {formatPrice(propertyClient.property.final_price)}</p>
                      </div>

                      {/* Cotitulares */}
                      {coOwners[propertyClient.property_id] && coOwners[propertyClient.property_id].length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <h6 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Cotitulares:
                          </h6>
                          <div className="space-y-1">
                            {coOwners[propertyClient.property_id].map((coOwner) => (
                              <p key={coOwner.id} className="text-sm text-gray-600">
                                {coOwner.first_name} {coOwner.last_name} ({coOwner.dni})
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Sin propiedades</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este cliente no tiene propiedades asignadas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón Cerrar */}
        <div className="flex justify-end mt-8 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;