import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Promotion, UserProfile } from '../types';
import toast from 'react-hot-toast';

interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromotionCreated: () => void;
  promotion?: Promotion | null;
  mode: 'create' | 'edit';
}

interface PromotionFormData {
  name: string;
  location: string;
  phase: string;
  status: 'active' | 'inactive' | 'completed';
  start_date: string;
  end_date?: string;
  commercial_id?: string;
  commission_percentage: number;
  promotor: string;
  captador_commission_amount: number;
  vendedor_commission_amount: number;
}

const PromotionFormModal: React.FC<PromotionFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onPromotionCreated, 
  promotion, 
  mode 
}) => {
  const [loading, setLoading] = useState(false);
  const [commercials, setCommercials] = useState<UserProfile[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<PromotionFormData>();

  useEffect(() => {
    if (isOpen) {
      loadCommercials();
      if (mode === 'edit' && promotion) {
        // Cargar datos de la promoción para editar
        setValue('name', promotion.name);
        setValue('location', promotion.location);
        setValue('phase', promotion.phase);
        setValue('status', promotion.status);
        setValue('start_date', promotion.start_date);
        setValue('end_date', promotion.end_date || '');
        setValue('commercial_id', promotion.commercial_id || '');
        setValue('commission_percentage', promotion.commission_percentage || 3);
        setValue('promotor', promotion.promotor);
        setValue('captador_commission_amount', promotion.captador_commission_amount);
        setValue('vendedor_commission_amount', promotion.vendedor_commission_amount);
      }
    }
  }, [isOpen, mode, promotion, setValue]);

  const loadCommercials = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'commercial')
        .order('full_name');

      if (error) {
        console.error('Error loading commercials:', error);
        return;
      }

      setCommercials(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmit = async (data: PromotionFormData) => {
    try {
      setLoading(true);

      const promotionData = {
        ...data,
        commission_percentage: Number(data.commission_percentage),
        captador_commission_amount: Number(data.captador_commission_amount),
        vendedor_commission_amount: Number(data.vendedor_commission_amount),
        commercial_id: data.commercial_id || null,
        end_date: data.end_date || null
      };

      let error;

      if (mode === 'create') {
        const { error: createError } = await supabase
          .from('promotions')
          .insert([promotionData]);
        error = createError;
      } else {
        const { error: updateError } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', promotion!.id);
        error = updateError;
      }

      if (error) {
        console.error('Error saving promotion:', error);
        toast.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} la promoción: ` + error.message);
        return;
      }

      toast.success(`Promoción ${mode === 'create' ? 'creada' : 'actualizada'} correctamente`);
      reset();
      onPromotionCreated();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error inesperado al ${mode === 'create' ? 'crear' : 'actualizar'} la promoción`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-600" />
            {mode === 'create' ? 'Nueva Promoción' : 'Editar Promoción'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Promoción *
                </label>
                <input
                  type="text"
                  placeholder="Residencial Las Flores"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('name', { 
                    required: 'El nombre es requerido',
                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  placeholder="Madrid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('location', { 
                    required: 'La ubicación es requerida',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fase *
                </label>
                <input
                  type="text"
                  placeholder="Fase 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('phase', { 
                    required: 'La fase es requerida'
                  })}
                />
                {errors.phase && (
                  <p className="mt-1 text-sm text-red-600">{errors.phase.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('status', { required: 'El estado es requerido' })}
                >
                  <option value="">Seleccionar estado</option>
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                  <option value="completed">Completada</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promotor *
                </label>
                <input
                  type="text"
                  placeholder="Promotora Madrid SL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('promotor', { 
                    required: 'El promotor es requerido'
                  })}
                />
                {errors.promotor && (
                  <p className="mt-1 text-sm text-red-600">{errors.promotor.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Fechas
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('start_date', { 
                    required: 'La fecha de inicio es requerida'
                  })}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('end_date')}
                />
              </div>
            </div>
          </div>

          {/* Comercial */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Asignación Comercial
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comercial Asignado
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                {...register('commercial_id')}
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

          {/* Comisiones */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Comisiones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porcentaje de Comisión (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="3.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('commission_percentage', { 
                    required: 'El porcentaje de comisión es requerido',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                    max: { value: 100, message: 'Debe ser menor o igual a 100' }
                  })}
                />
                {errors.commission_percentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.commission_percentage.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comisión Captador (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1500.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('captador_commission_amount', { 
                    required: 'La comisión del captador es requerida',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                />
                {errors.captador_commission_amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.captador_commission_amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comisión Vendedor (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="2000.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  {...register('vendedor_commission_amount', { 
                    required: 'La comisión del vendedor es requerida',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                />
                {errors.vendedor_commission_amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.vendedor_commission_amount.message}</p>
                )}
              </div>
            </div>
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
                : (mode === 'create' ? 'Crear Promoción' : 'Actualizar Promoción')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionFormModal;