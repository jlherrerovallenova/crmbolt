import React from 'react';

const Properties: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Viviendas</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gestión de viviendas y propiedades
        </p>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Viviendas
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Aquí se mostrarán todas las viviendas disponibles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;