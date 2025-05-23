import React, { useState } from 'react';
import { Route } from '../types';
import { useAppContext } from '../context/AppContext';
import { Map, Clock, AlertCircle } from 'lucide-react';

interface RouteMap {
  name: string;
  url: string;
}

interface RouteMaps {
  [key: string]: RouteMap[];
}

const ROUTE_MAPS: RouteMaps = {
  'Norte': [
    { name: 'Día', url: 'https://i.ibb.co/WW80HSPP/Dia.png' },
    { name: 'Noche', url: 'https://i.ibb.co/QFTYQVkZ/Noche.png' }
  ],
  'Puente Piedra': [
    { name: 'Día', url: 'https://i.ibb.co/k29ZyFFP/Dia.png' },
    { name: 'Tarde', url: 'https://i.ibb.co/8tYYT9n/Tarde.png' },
    { name: 'Noche', url: 'https://i.ibb.co/gLtj1QF3/Noche.png' }
  ],
  'Este': [
    { name: 'Día', url: 'https://i.ibb.co/Y7VzmPJs/Dia.png' },
    { name: 'Noche', url: 'https://i.ibb.co/hJgNLHrc/1SoloBus.png' },
    { name: 'Ruta A', url: 'https://i.ibb.co/5xS1G2DY/RutaA.png' },
    { name: 'Ruta B', url: 'https://i.ibb.co/39mC9r82/RutaB.png' }
  ],
  'Ate': [
    { name: 'Día', url: 'https://i.ibb.co/HT4wH9jc/Dia.png' },
    { name: 'Noche', url: 'https://i.ibb.co/BVy5FBQ9/Noche.png' }
  ],
  'Sur': [
    { name: 'Día', url: 'https://i.ibb.co/M5xSsHXM/Dia.png' },
    { name: 'Expreso', url: 'https://i.ibb.co/Y4nnBDxQ/Expreso.png' },
    { name: 'Mulita', url: 'https://i.ibb.co/Y4YB4fFn/Mulita.png' },
    { name: 'Noche', url: 'https://i.ibb.co/qLBGKCWR/Noche-1-Solo-Bus.png' }
  ]
};

const RouteMapDisplay: React.FC = () => {
  const { state, getRouteColor } = useAppContext();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedMap, setSelectedMap] = useState<RouteMap | null>(null);

  const availableRoutes = Object.keys(ROUTE_MAPS);

  const handleRouteClick = (route: Route) => {
    if (ROUTE_MAPS[route] && ROUTE_MAPS[route].length > 0) {
      setSelectedRoute(route);
      setSelectedMap(ROUTE_MAPS[route][0]);
    }
  };

  const handleMapClick = (map: RouteMap) => {
    setSelectedMap(map);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Map className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Mapas de Rutas</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <div className="flex flex-wrap lg:flex-col gap-2">
            {availableRoutes.map(route => {
              const routeConfig = state.routes[route] || { name: route };
              const routeColor = getRouteColor(route);
              const mapCount = ROUTE_MAPS[route]?.length || 0;
              
              return (
                <button
                  key={route}
                  onClick={() => handleRouteClick(route)}
                  className={`text-left px-4 py-2 rounded-md text-sm font-medium border-b-2 transition-colors lg:w-full lg:border-l-4 lg:border-b-0 ${
                    selectedRoute === route
                      ? 'border-current'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={{
                    borderColor: selectedRoute === route ? routeColor : undefined,
                    color: selectedRoute === route ? routeColor : undefined
                  }}
                >
                  <div className="font-medium">
                    {routeConfig.name}
                    <span className="hidden lg:block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {mapCount} horarios
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:w-3/4">
          {selectedRoute && ROUTE_MAPS[selectedRoute] ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {ROUTE_MAPS[selectedRoute].map(map => (
                  <button
                    key={map.name}
                    onClick={() => handleMapClick(map)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedMap === map
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    {map.name}
                  </button>
                ))}
              </div>

              {selectedMap && (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={selectedMap.url}
                      alt={`Mapa de ruta ${selectedRoute} - ${selectedMap.name}`}
                      className="w-full h-auto object-contain max-h-[600px]"
                    />
                  </div>
                  <div className="flex items-center justify-end text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Los horarios están sujetos a disponibilidad</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  Selecciona una ruta para ver sus mapas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteMapDisplay;