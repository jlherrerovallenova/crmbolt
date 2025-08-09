import React from 'react';

const Setup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Configuración del Sistema
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Configuración inicial del CRM Inmobiliario
          </p>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Estado del Sistema
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                El sistema está siendo configurado. Por favor, espere...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;