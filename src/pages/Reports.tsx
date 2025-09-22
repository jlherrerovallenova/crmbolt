import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Home, Users, Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [salesByPromotion, setSalesByPromotion] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProperties: 0,
    totalClients: 0
  });

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);

      // Load properties with promotion info
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          promotion:promotions(name, location)
        `);

      if (propertiesError) {
        console.error('Error loading properties:', propertiesError);
        toast.error('Error al cargar los datos de reportes');
        return;
      }

      // Load clients count
      const { count: clientsCount, error: clientsError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      if (clientsError) {
        console.error('Error loading clients count:', clientsError);
      }

      // Process sales by promotion
      const promotionSales = properties?.reduce((acc: any, property: any) => {
        const promotionName = property.promotion?.name || 'Sin promoción';
        if (!acc[promotionName]) {
          acc[promotionName] = {
            name: promotionName,
            ventas: 0,
            ingresos: 0,
            total: 0
          };
        }
        
        acc[promotionName].total += 1;
        
        if (['sold', 'contract_signed', 'deed_signed'].includes(property.status)) {
          acc[promotionName].ventas += 1;
          acc[promotionName].ingresos += property.final_price || 0;
        }
        
        return acc;
      }, {});

      const salesData = Object.values(promotionSales || {});

      // Process status distribution
      const statusCount = properties?.reduce((acc: any, property: any) => {
        const status = property.status;
        if (!acc[status]) {
          acc[status] = { name: getStatusText(status), value: 0, color: getStatusColor(status) };
        }
        acc[status].value += 1;
        return acc;
      }, {});

      const statusData = Object.values(statusCount || {});

      // Calculate totals
      const soldProperties = properties?.filter(p => 
        ['sold', 'contract_signed', 'deed_signed'].includes(p.status)
      ) || [];
      
      const totalRevenue = soldProperties.reduce((sum, property) => sum + (property.final_price || 0), 0);

      setSalesByPromotion(salesData);
      setStatusDistribution(statusData);
      setTotalStats({
        totalSales: soldProperties.length,
        totalRevenue,
        totalProperties: properties?.length || 0,
        totalClients: clientsCount || 0
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al cargar reportes');
    } finally {
      setLoading(false);
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
      case 'active': return '#10B981';
      case 'reserved': return '#F59E0B';
      case 'contract_signed': return '#3B82F6';
      case 'sold': return '#8B5CF6';
      case 'deed_signed': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando reportes...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow h-96 bg-gray-300"></div>
            <div className="bg-white p-6 rounded-lg shadow h-96 bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      name: 'Total Ventas',
      value: totalStats.totalSales,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Ingresos Totales',
      value: formatCurrency(totalStats.totalRevenue),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Total Viviendas',
      value: totalStats.totalProperties,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Clientes',
      value: totalStats.totalClients,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Análisis y estadísticas del sistema
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Promotion */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ventas por Promoción</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByPromotion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'ingresos' ? formatCurrency(Number(value)) : value,
                  name === 'ventas' ? 'Ventas' : 'Ingresos'
                ]}
              />
              <Legend />
              <Bar dataKey="ventas" fill="#3B82F6" name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumen Detallado por Promoción
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Información detallada de ventas e ingresos por promoción
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promoción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Viviendas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Vendidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesByPromotion.map((promotion: any) => (
                <tr key={promotion.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {promotion.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.ventas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.total > 0 ? ((promotion.ventas / promotion.total) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(promotion.ingresos)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;