import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { Users as UsersIcon, Mail, Shield, Calendar, Plus, Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast.error('Error al cargar los usuarios');
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'commercial': return 'Comercial';
      case 'client': return 'Cliente';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando usuarios...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión de usuarios del sistema ({filteredUsers.length} usuarios)
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
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
                placeholder="Buscar usuarios por nombre o email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="commercial">Comercial</option>
              <option value="client">Cliente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id} className="hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {user.full_name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleText(user.role)}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver detalles
                    </button>
                  </div>
                </div>
                
                {user.created_at && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Registrado: {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter !== 'all'
              ? 'No se encontraron usuarios con los filtros aplicados.'
              : 'Comienza agregando un nuevo usuario.'
            }
          </p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Resumen de Usuarios
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-500">Administradores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'commercial').length}
              </div>
              <div className="text-sm text-gray-500">Comerciales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.role === 'client').length}
              </div>
              <div className="text-sm text-gray-500">Clientes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;