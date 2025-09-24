import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Phone, Mail, MapPin, CreditCard, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Client } from '../types';
import { 
  validateDNIOrNIE, 
  validateSpanishIBAN, 
  validateSpanishPhone,
  getBankNameFromIBAN,
  formatIBAN 
} from '../utils/validators';
import toast from 'react-hot-toast';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: () => void;
  client?: Client | null;
  mode: 'create' | 'edit';
}

interface ClientFormData {
  first_name: string;
  last_name: string;
  dni: string;
  address: string;
  postal_code: string;
  municipality: string;
  province: string;
  email_1: string;
  phone_1: string;
  phone_2?: string;
  marital_status: string;
  bank_account: string;
  observations?: string;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onClientCreated, 
  client = null, 
  mode = 'create' 
}) => {
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ClientFormData>();

  // Cargar datos del cliente cuando se edita
  React.useEffect(() => {
    if (mode === 'edit' && client && isOpen) {
      setValue('first_name', client.first_name);
      setValue('last_name', client.last_name);
      setValue('dni', client.dni);
      setValue('address', client.address);
      setValue('postal_code', client.postal_code);
      setValue('municipality', client.municipality);
      setValue('province', client.province);
      setValue('email_1', client.email_1);
      setValue('phone_1', client.phone_1);
      setValue('phone_2', client.phone_2 || '');
      setValue('marital_status', client.marital_status);
      setValue('bank_account', client.bank_account);
      setValue('observations', client.observations || '');
    } else if (mode === 'create' && isOpen) {
      reset();
    }
  }, [mode, client, isOpen, setValue, reset]);

  const watchedIBAN = watch('bank_account');

  // Actualizar nombre del banco cuando cambia el IBAN
  React.useEffect(() => {
    if (watchedIBAN && validateSpanishIBAN(watchedIBAN)) {
      const bank = getBankNameFromIBAN(watchedIBAN);
      setBankName(bank);
    } else {
      setBankName('');
    }
  }, [watchedIBAN]);

  const maritalStatusOptions = [
    { value: 'single', label: 'Soltero/a' },
    { value: 'married_community', label: 'Casado/a en gananciales' },
    { value: 'married_separation', label: 'Casado/a en separación de bienes' },
    { value: 'domestic_partnership', label: 'Pareja de hecho' },
    { value: 'divorced', label: 'Divorciado/a' },
    { value: 'widowed', label: 'Viudo/a' }
  ];

  const onSubmit = async (data: ClientFormData) => {
    try {
      setLoading(true);

      // Formatear datos antes de enviar
      const clientData = {
        ...data,
        dni: data.dni.toUpperCase(),
        email_1: data.email_1.toLowerCase(),
        phone_1: data.phone_1.replace(/\s/g, ''),
        phone_2: data.phone_2?.replace(/\s/g, '') || null,
        bank_account: formatIBAN(data.bank_account)
      };

      let error;
      
      if (mode === 'create') {
        const result = await supabase
          .from('clients')
          .insert([clientData]);
        error = result.error;
      } else {
        const result = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', client!.id);
        error = result.error;
      }

      if (error) {
        console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} client:`, error);
        if (error.code === '23505') {
          toast.error('Ya existe un cliente con este DNI/NIE');
        } else {
          toast.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} el cliente: ` + error.message);
        }
        return;
      }

      toast.success(`Cliente ${mode === 'create' ? 'creado' : 'actualizado'} correctamente`);
      reset();
      setBankName('');
      onClientCreated();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error inesperado al ${mode === 'create' ? 'crear' : 'actualizar'} el cliente`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setBankName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Personal */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Información Personal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    {...register('first_name', { 
                      required: 'El nombre es requerido',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  <input
                    type="text"
                    placeholder="Apellidos"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    {...register('last_name', { 
                      required: 'Los apellidos son requeridos',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                </div>
                {(errors.first_name || errors.last_name) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.first_name?.message || errors.last_name?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI / NIE *
                </label>
                <input
                  type="text"
                  placeholder="12345678A o X1234567A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('dni', {
                    required: 'El DNI/NIE es requerido',
                    validate: (value) => validateDNIOrNIE(value) || 'DNI/NIE no válido'
                  })}
                />
                {errors.dni && (
                  <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  Estado Civil *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('marital_status', { required: 'El estado civil es requerido' })}
                >
                  <option value="">Seleccionar estado civil</option>
                  {maritalStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.marital_status && (
                  <p className="mt-1 text-sm text-red-600">{errors.marital_status.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Información de Contacto
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('email_1', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email no válido'
                    }
                  })}
                />
                {errors.email_1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.email_1.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono 1 *
                </label>
                <input
                  type="tel"
                  placeholder="666123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('phone_1', {
                    required: 'El teléfono es requerido',
                    validate: (value) => validateSpanishPhone(value) || 'Teléfono no válido (debe tener 9 dígitos)'
                  })}
                />
                {errors.phone_1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_1.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono 2
                </label>
                <input
                  type="tel"
                  placeholder="915551234 (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('phone_2', {
                    validate: (value) => !value || validateSpanishPhone(value) || 'Teléfono no válido'
                  })}
                />
                {errors.phone_2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_2.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Dirección
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  placeholder="Calle Mayor 15, 3º B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('address', { required: 'La dirección es requerida' })}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal *
                </label>
                <input
                  type="text"
                  placeholder="28001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('postal_code', {
                    required: 'El código postal es requerido',
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: 'Código postal no válido (5 dígitos)'
                    }
                  })}
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio *
                </label>
                <input
                  type="text"
                  placeholder="Madrid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('municipality', { required: 'El municipio es requerido' })}
                />
                {errors.municipality && (
                  <p className="mt-1 text-sm text-red-600">{errors.municipality.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  type="text"
                  placeholder="Madrid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('province', { required: 'La provincia es requerida' })}
                />
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Bancaria */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Información Bancaria
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nº de Cuenta (IBAN) *
              </label>
              <input
                type="text"
                placeholder="ES12 3456 7890 1234 5678 9012"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register('bank_account', {
                  required: 'El IBAN es requerido',
                  validate: (value) => validateSpanishIBAN(value) || 'IBAN español no válido'
                })}
              />
              {errors.bank_account && (
                <p className="mt-1 text-sm text-red-600">{errors.bank_account.message}</p>
              )}
              {bankName && (
                <p className="mt-1 text-sm text-green-600 font-medium">
                  Banco: {bankName}
                </p>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              rows={3}
              placeholder="Información adicional sobre el cliente..."
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
                : (mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;