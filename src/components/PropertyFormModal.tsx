import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Home, Building2, MapPin, Bed, Square, Euro, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Property, Promotion, UserProfile, Client } from '../types';
import toast from 'react-hot-toast';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyCreated: () => void;
  property?: Property | null;
  mode: 'create' | 'edit';
}

interface PropertyFormData {
  promotion_id: string;
  floor: number;
  letter: string;
  bedrooms: number;
  typology: 'interior' | 'exterior';
  orientation: 'north' | 'south' | 'southwest' | 'east' | 'west' | 'northwest' | 'northeast' | 'southeast';
  useful_surface: number;
  built_surface: number;
  terrace_surface: number;
  garage_number?: string;
  storage_number?: string;
  final_price: number;
  status: 'active' | 'reserved' | 'contract_signed' | 'sold' | 'deed_signed';
  observations?: string;
  vendedor_commercial_id?: string;
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onPropertyCreated, 
  property, 
  mode 
}) => {
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [commercials, setCommercials] = useState<UserProfile[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [primaryBuyer, setPrimaryBuyer] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<PropertyFormData>();

  const watchedPromotion = watch('promotion_id');

  useEffect(() => {
    if (isOpen) {
      loadFormData();
      if (mode === 'edit' && property) {
        loadPropertyData();
      }
    }
  }, [isOpen, mode, property]);

  const loadFormData = async () => {
    try {
      // Load promotions
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .order('name');

      if (promotionsError) {
        console.error('Error loading promotions:', promotionsError);
      } else {
        setPromotions(promotionsData || []);
      }

      // Load commercials
      const { data: commercialsData, error: commercialsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'commercial')
        .order('full_name');

      if (commercialsError) {
        console.error('Error loading commercials:', commercialsError);
      } else {
        setCommercials(commercialsData || []);
      }

      // Load clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('first_name', { ascending: true });

      if (clientsError) {
        console.error('Error loading clients:', clientsError);
      } else {
        setClients(clientsData || []);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const loadPropertyData = async () => {
    if (!property) return;

    // Set form values
    setValue('promotion_id', property.promotion_id);
    setValue('floor', property.floor);
    setValue('letter', property.letter);
    setValue('bedrooms', property.bedrooms);
    setValue('typology', property.typology);
    setValue('orientation', property.orientation);
    setValue('useful_surface', property.useful_surface);
    setValue('built_surface', property.built_surface);
    setValue('terrace_surface', property.terrace_surface || 0);
    setValue('garage_number', property.garage_number || '');
    setValue('storage_number', property.storage_number || '');
    setValue('final_price', property.final_price);
    setValue('status', property.status);
    setValue('observations', property.observations || '');
    setValue('vendedor_commercial_id', property.vendedor_commercial_id || '');

    // Load assigned clients
    try {
      const { data: propertyClients, error } = await supabase
        .from('property_clients')
        .select('client_id, is_primary_buyer')
        .eq('property_id', property.id);

      if (error) {
        console.error('Error loading property clients:', error);
      } else {
        const clientIds = propertyClients?.map(pc => pc.client_id) || [];
        const primary = propertyClients?.find(pc => pc.is_primary_buyer)?.client_id || '';
        
        setSelectedClients(clientIds);
        setPrimaryBuyer(primary);
      }
    } catch (error) {
      console.error('Error loading property clients:', error);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setLoading(true);

      const propertyData = {
        ...data,
        floor: Number(data.floor),
        bedrooms: Number(data.bedrooms),
        useful_surface: Number(data.useful_surface),
        built_surface: Number(data.built_surface),
        terrace_surface: Number(data.terrace_surface),
        final_price: Number(data.final_price),
        vendedor_commercial_id: data.vendedor_commercial_id || null,
        garage_number: data.garage_number || null,
        storage_number: data.storage_number || null,
        observations: data.observations || null
      };

      let propertyId: string;
      let error;

      if (mode === 'create') {
        const { data: newProperty, error: createError } = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();
        
        error = createError;
        propertyId = newProperty?.id;
      } else {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property!.id);
        
        error = updateError;
        propertyId = property!.id;
      }

      if (error) {
        console.error('Error saving property:', error);
        toast.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} la vivienda: ` + error.message);
        return;
      }

      // Handle client assignments
      if (propertyId && selectedClients.length > 0) {
        // Remove existing assignments
        await supabase
          .from('property_clients')
          .delete()
          .eq('property_id', propertyId);

        // Add new assignments
        const assignments = selectedClients.map(clientId => ({
          property_id: propertyId,
          client_id: clientId,
          is_primary_buyer: clientId === primaryBuyer
        }));

        const { error: assignmentError } = await supabase
          .from('property_clients')
          .insert(assignments);

        if (assignmentError) {
          console.error('Error assigning clients:', assignmentError);
          toast.error('Error al asignar compradores');
          return;
        }
      }

      toast.success(`Vivienda ${mode === 'create' ? 'creada' : 'actualizada'} correctamente`);
      handleClose();
      onPropertyCreated();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error inesperado al ${mode === 'create' ? 'crear' : 'actualizar'} la vivienda`);
    } finally {
      setLoading(false);
    }
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        const newSelected = prev.filter(id => id !== clientId);
        // If removing primary buyer, clear primary buyer
        if (clientId === primaryBuyer) {
          setPrimaryBuyer('');
        }
        return newSelected;
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handlePrimaryBuyerChange = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setPrimaryBuyer(clientId);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedClients([]);
    setPrimaryBuyer('');
    onClose();
  };

  if (!isOpen) return null;

  const orientationOptions = [
    { value: 'north', label: 'Norte' },
    { value: 'northeast', label: 'Noreste' },
    { value: 'east', label: 'Este' },
    { value: 'southeast', label: 'Sureste' },
    { value: 'south', label: 'Sur' },
    { value: 'southwest', label: 'Suroeste' },
    { value: 'west', label: 'Oeste' },
    { value: 'northwest', label: 'Noroeste' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Disponible' },
    { value: 'reserved', label: 'Reservada' },
    { value: 'contract_signed', label: 'Contrato firmado' },
    { value: 'sold', label: 'Vendida' },
    { value: 'deed_signed', label: 'Escriturada' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Home className="h-5 w-5 mr-2 text-blue-600" />
            {mode === 'create' ? 'Nueva Vivienda' : 'Editar Vivienda'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Información Básica
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promoción *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('promotion_id', { required: 'La promoción es requerida' })}
                >
                  <option value="">Seleccionar promoción</option>
                  {promotions.map((promotion) => (
                    <option key={promotion.id} value={promotion.id}>
                      {promotion.name} - {promotion.location}
                    </option>
                  ))}
                </select>
                {errors.promotion_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.promotion_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planta *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('floor', { 
                    required: 'La planta es requerida',
                    min: { value: 0, message: 'Mínimo 0' },
                    max: { value: 50, message: 'Máximo 50' }
                  })}
                />
                {errors.floor && (
                  <p className="mt-1 text-sm text-red-600">{errors.floor.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Letra *
                </label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('letter', { 
                    required: 'La letra es requerida',
                    maxLength: { value: 2, message: 'Máximo 2 caracteres' }
                  })}
                />
                {errors.letter && (
                  <p className="mt-1 text-sm text-red-600">{errors.letter.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dormitorios *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('bedrooms', { required: 'Los dormitorios son requeridos' })}
                >
                  <option value="">Seleccionar</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} dormitorio{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipología *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('typology', { required: 'La tipología es requerida' })}
                >
                  <option value="">Seleccionar</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                </select>
                {errors.typology && (
                  <p className="mt-1 text-sm text-red-600">{errors.typology.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orientación *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('orientation', { required: 'La orientación es requerida' })}
                >
                  <option value="">Seleccionar</option>
                  {orientationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.orientation && (
                  <p className="mt-1 text-sm text-red-600">{errors.orientation.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Superficies */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Square className="h-4 w-4 mr-2" />
              Superficies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie Útil (m²) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('useful_surface', { 
                    required: 'La superficie útil es requerida',
                    min: { value: 0, message: 'Debe ser mayor a 0' }
                  })}
                />
                {errors.useful_surface && (
                  <p className="mt-1 text-sm text-red-600">{errors.useful_surface.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie Construida (m²) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('built_surface', { 
                    required: 'La superficie construida es requerida',
                    min: { value: 0, message: 'Debe ser mayor a 0' }
                  })}
                />
                {errors.built_surface && (
                  <p className="mt-1 text-sm text-red-600">{errors.built_surface.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Superficie Terraza (m²)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('terrace_surface', { 
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                />
                {errors.terrace_surface && (
                  <p className="mt-1 text-sm text-red-600">{errors.terrace_surface.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Anexos y Precio */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Euro className="h-4 w-4 mr-2" />
              Anexos y Precio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Garaje
                </label>
                <input
                  type="text"
                  placeholder="G-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('garage_number')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Trastero
                </label>
                <input
                  type="text"
                  placeholder="T-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('storage_number')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Final (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('final_price', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'Debe ser mayor a 0' }
                  })}
                />
                {errors.final_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.final_price.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Estado y Comercial */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Estado y Comercial
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('status', { required: 'El estado es requerido' })}
                >
                  <option value="">Seleccionar estado</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comercial Vendedor
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('vendedor_commercial_id')}
                >
                  <option value="">Sin asignar</option>
                  {commercials.map((commercial) => (
                    <option key={commercial.id} value={commercial.id}>
                      {commercial.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Asignación de Compradores */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Asignación de Compradores
            </h4>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-white">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleClientToggle(client.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{client.dni} - {client.email_1}</p>
                    </div>
                  </div>
                  {selectedClients.includes(client.id) && (
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="primary_buyer"
                        checked={primaryBuyer === client.id}
                        onChange={() => handlePrimaryBuyerChange(client.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-xs text-gray-600">Principal</label>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {selectedClients.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {selectedClients.length} comprador{selectedClients.length > 1 ? 'es' : ''} seleccionado{selectedClients.length > 1 ? 's' : ''}
                {primaryBuyer && ` (Principal: ${clients.find(c => c.id === primaryBuyer)?.first_name} ${clients.find(c => c.id === primaryBuyer)?.last_name})`}
              </p>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              rows={3}
              placeholder="Información adicional sobre la vivienda..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              {...register('observations')}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (mode === 'create' ? 'Creando...' : 'Actualizando...') 
                : (mode === 'create' ? 'Crear Vivienda' : 'Actualizar Vivienda')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;