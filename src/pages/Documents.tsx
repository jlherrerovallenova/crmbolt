import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Document } from '../types';
import { FileText, Download, Upload, Search, Filter, Calendar, User, Building2, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploader:users!documents_uploaded_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading documents:', error);
        toast.error('Error al cargar los documentos');
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.document_category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return Building2;
      case 'property': return Home;
      case 'client': return User;
      default: return FileText;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'promotion': return 'Promoción';
      case 'property': return 'Vivienda';
      case 'client': return 'Cliente';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promotion': return 'bg-blue-100 text-blue-800';
      case 'property': return 'bg-green-100 text-green-800';
      case 'client': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="mt-1 text-sm text-gray-600">Cargando documentos...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión de documentos y archivos ({filteredDocuments.length} documentos)
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Subir Documento
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
                placeholder="Buscar documentos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="promotion">Promoción</option>
              <option value="property">Vivienda</option>
              <option value="client">Cliente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => {
            const TypeIcon = getTypeIcon(document.type);
            return (
              <li key={document.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TypeIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {document.name}
                        </h3>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                            {getTypeText(document.type)}
                          </span>
                          {document.document_category && (
                            <span className="text-xs text-gray-500">
                              {document.document_category}
                            </span>
                          )}
                          {document.is_required && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Requerido
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(document.created_at!).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {document.uploader?.full_name || 'Usuario desconocido'}
                    </div>
                    <div>
                      Tamaño: {formatFileSize(document.file_size)}
                    </div>
                    <div>
                      Versión: {document.version}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {filteredDocuments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter !== 'all'
              ? 'No se encontraron documentos con los filtros aplicados.'
              : 'Comienza subiendo un nuevo documento.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;