import React, { useState } from 'react';
import { Route } from '../types';
import { useAppContext } from '../context/AppContext';
import { Bus, Settings, LogOut, Handshake, Moon, Sun } from 'lucide-react';
import StudentManagement from '../components/AdminPanel/StudentManagement';
import RouteConfiguration from '../components/AdminPanel/RouteConfiguration';
import ClarificationsList from '../components/AdminPanel/ClarificationsList';

interface AdminPanelProps {
  onLogout: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, isDark, onThemeToggle }) => {
  const { logout, state, getSortedRoutes } = useAppContext();
  const [activeTab, setActiveTab] = useState<Route>('Norte');
  const [showSettings, setShowSettings] = useState(false);
  const [showClarifications, setShowClarifications] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleClarificationsClick = () => {
    setShowClarifications(!showClarifications);
    setShowSettings(false);
  };

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    setShowClarifications(false);
  };

  const sortedRoutes = getSortedRoutes();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Panel de Administración
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button
                onClick={handleClarificationsClick}
                className={`p-2 rounded-md ${
                  showClarifications 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Lista de Aclaratorias"
              >
                <Handshake className="h-5 w-5" />
              </button>

              <button
                onClick={handleSettingsClick}
                className={`p-2 rounded-md ${
                  showSettings 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Configuración de rutas"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showSettings ? (
          <RouteConfiguration onClose={() => setShowSettings(false)} />
        ) : showClarifications ? (
          <ClarificationsList onClose={() => setShowClarifications(false)} />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-x-auto">
              <div className="px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4 overflow-x-auto scrollbar-none py-2">
                  {sortedRoutes.map(([route, config]) => (
                    <button
                      key={route}
                      onClick={() => setActiveTab(route)}
                      className={`whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 
                        ${activeTab === route 
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                      {config.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            <StudentManagement route={activeTab} />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;