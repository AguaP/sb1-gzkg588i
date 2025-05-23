import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const { login } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!password.trim()) {
      setError('Ingresa la contraseña');
      return;
    }
    
    const success = login(password);
    if (success) {
      onSuccess();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Volver
      </button>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Panel de Administración</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Ingresa la contraseña para acceder</p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ingresa la contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span className="text-sm">Ocultar</span>
                  ) : (
                    <span className="text-sm">Mostrar</span>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Pista: La contraseña contiene el nombre de una de las carnes utilizadas en el comedor, año, y un carácter especial.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;