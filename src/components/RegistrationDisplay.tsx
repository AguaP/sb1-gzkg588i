import React, { useState, useEffect } from 'react';
import { Route, Student } from '../types';
import { useAppContext } from '../context/AppContext';
import { Search, Users, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import RouteMapDisplay from './RouteMapDisplay';

const ITEMS_PER_PAGE = 10;

const RegistrationDisplay: React.FC = () => {
  const { state, setCurrentRoute, getSortedRoutes, getRouteColor } = useAppContext();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let students = state.students;
    
    if (selectedRoute) {
      students = students.filter(student => student.route === selectedRoute);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      students = students.filter(
        student => 
          student.name.toLowerCase().includes(term) || 
          student.lastName.toLowerCase().includes(term) || 
          student.code.toLowerCase().includes(term)
      );
    }
    
    students = [...students].sort((a, b) => a.ticketNumber - b.ticketNumber);
    
    setFilteredStudents(students);
    setCurrentPage(1);
  }, [selectedRoute, searchTerm, state.students]);

  const handleRouteChange = (route: Route | null) => {
    setSelectedRoute(route);
    setCurrentRoute(route);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const activeRoutes = getSortedRoutes()
    .filter(([_, config]) => config.isActive)
    .map(([route]) => route as Route);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Lista de Registros</h2>
        
        <div className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRouteChange(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium border-b-2 transition-colors
                ${selectedRoute === null 
                  ? 'border-gray-800 dark:border-white text-gray-800 dark:text-white' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              Todos
            </button>
            
            {activeRoutes.map(route => {
              const routeConfig = state.routes[route];
              const routeColor = getRouteColor(route);
              return (
                <button
                  key={route}
                  onClick={() => handleRouteChange(route)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border-b-2 transition-colors
                    ${selectedRoute === route 
                      ? 'border-current' 
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'}`}
                  style={{ 
                    borderColor: selectedRoute === route ? routeColor : undefined,
                    color: selectedRoute === route ? routeColor : undefined
                  }}
                >
                  {routeConfig.name}
                </button>
              );
            })}
          </div>
          
          <div className="relative flex-grow md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
        
        {filteredStudents.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estudiante
                    </th>
                    {!selectedRoute && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ruta
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedStudents.map(student => {
                    const routeConfig = state.routes[student.route];
                    const routeColor = getRouteColor(student.route);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {student.ticketNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name} {student.lastName}
                          </div>
                        </td>
                        {!selectedRoute && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
                              style={{ 
                                backgroundColor: `${routeColor}15`,
                                color: routeColor
                              }}
                            >
                              {routeConfig.name}
                            </span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)}
                      </span>{' '}
                      de <span className="font-medium">{filteredStudents.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Anterior</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            ${currentPage === index + 1
                              ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Siguiente</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-lg text-gray-500 dark:text-gray-400">No hay estudiantes registrados</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                No se encontraron resultados para "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>

      <RouteMapDisplay />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Phone className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Contactanos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a 
            href="https://wa.me/51950945936"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg transition-colors hover:bg-blue-200 dark:hover:bg-blue-900/30"
          >
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Norte</h3>
            <div className="inline-flex items-center text-blue-600 dark:text-blue-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              Piero
            </div>
          </a>
          
          <a 
            href="https://wa.me/51922990084"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-green-100 dark:bg-green-900/20 rounded-lg transition-colors hover:bg-green-200 dark:hover:bg-green-900/30"
          >
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Puente Piedra</h3>
            <div className="inline-flex items-center text-green-600 dark:text-green-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              Jhohan DeleJato
            </div>
          </a>
          
          <a 
            href="https://wa.me/51921247828"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg transition-colors hover:bg-amber-200 dark:hover:bg-amber-900/30"
          >
            <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Este</h3>
            <div className="inline-flex items-center text-amber-600 dark:text-amber-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              Marcos
            </div>
          </a>
          
          <a 
            href="https://wa.me/51923554825"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors hover:bg-red-200 dark:hover:bg-red-900/30"
          >
            <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Ate</h3>
            <div className="inline-flex items-center text-red-600 dark:text-red-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              Jhon
            </div>
          </a>
          
          <a 
            href="https://wa.me/51919660471"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg transition-colors hover:bg-purple-200 dark:hover:bg-purple-900/30"
          >
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Sur</h3>
            <div className="inline-flex items-center text-purple-600 dark:text-purple-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              Franco
            </div>
          </a>
          
          <a 
            href="https://wa.me/51939480718"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg transition-colors hover:bg-cyan-200 dark:hover:bg-cyan-900/30"
          >
            <h3 className="font-semibold text-cyan-700 dark:text-cyan-300 mb-2">Soporte Técnico</h3>
            <div className="inline-flex items-center text-cyan-600 dark:text-cyan-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              Agua💧
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDisplay;