import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, Home, Users, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    promotions: 0,
    properties: 0,
    clients: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Iniciando carga de datos del dashboard...');
      console.log('📡 URL de Supabase:', import.meta.env.VITE_SUPABASE_URL);
      console.log('🔑 API Key configurada:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('promotions')
        .select('count')
        .limit(1);

      console.log('🧪 Test de conexión:', { testData, testError });

      if (testError) {
        throw new Error(`Error de conexión: ${testError.message}`);
      }

      // Load promotions
      const { data: promotions, error: promotionsError } = await supabase
        .from('promotions')
        .select('*');

      console.log('🏢 Promociones cargadas:', promotions?.length || 0);
      if (promotionsError) console.error('❌ Error promociones:', promotionsError);

      // Load properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*');

      console.log('🏠 Propiedades cargadas:', properties?.length || 0);
      if (propertiesError) console.error('❌ Error propiedades:', propertiesError);

      // Load clients
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      console.log('👥 Clientes cargados:', clients?.length || 0);
      if (clientsError) console.error('❌ Error clientes:', clientsError);

      // Calculate total revenue from sold properties
      const soldProperties = properties?.filter(p => 
        p.status === 'sold' || p.status === 'contract_signed' || p.status === 'deed_signed'
      ) || [];

      const totalRevenue = soldProperties.reduce((sum, property) => sum + (property.final_price || 0), 0);

      setStats({
        promotions: promotions?.length || 0,
        properties: properties?.length || 0,
        clients: clients?.length || 0,
        totalRevenue
      });

      console.log('📊 Estadísticas finales:', {
        promotions: promotions?.length || 0,
        properties: properties?.length || 0,
        clients: clients?.length || 0,
        totalRevenue
      });

    } catch (error) {
      console.error('💥 Error cargando datos:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando datos...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Error al cargar datos</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error de conexión
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <button 
                  onClick={loadDashboardData}
                  className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const statsCards = [
    {
      name: 'Promociones Activas',
      value: stats.promotions,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Viviendas',
      value: stats.properties,
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Clientes Registrados',
      value: stats.clients,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Ingresos Totales',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido al CRM Inmobiliario
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-md ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">
          Información de Debug
        </h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>URL Supabase: {import.meta.env.VITE_SUPABASE_URL}</p>
          <p>API Key configurada: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Sí' : 'No'}</p>
          <p>Datos cargados: {stats.promotions + stats.properties + stats.clients > 0 ? 'Sí' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;