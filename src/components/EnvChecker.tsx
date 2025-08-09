import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const EnvChecker: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-50">
      <div className="flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">
          Variables de entorno de Supabase no configuradas. Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env
        </span>
      </div>
    </div>
  );
};

export default EnvChecker;