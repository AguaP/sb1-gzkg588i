import React, { useState } from 'react';
import { Faculty, Route } from '../types';
import { useAppContext } from '../context/AppContext';
import { BusFront, AlertCircle, User, BookOpen, Phone } from 'lucide-react';

const FACULTIES: Faculty[] = [
  'FAUA', 'FC', 'FIA', 'FIC', 'FIEECS', 'FIEE', 'FIGMM', 'FIIS', 'FIM', 'FIP', 'FIQT'
];

interface RegistrationFormProps {
  onRegistrationSuccess: (ticketData: any) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistrationSuccess }) => {
  const { registerStudent, isCodeRegistered, state, getSortedRoutes, getRouteColor, isCodeInClarificationList } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    code: '',
    faculty: '' as Faculty,
    route: '' as Route,
    phone: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [codeStatus, setCodeStatus] = useState<{ isValid: boolean; message: string; type?: 'warning' | 'error' | 'success' } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'code') {
      setCodeStatus(null);
      setError(null);
    }
  };

  const handleRouteChange = (route: Route) => {
    setFormData(prev => ({ ...prev, route }));
    setError(null);
  };

  const validateCode = () => {
    if (!formData.code.trim()) {
      setCodeStatus(null);
      return false;
    }
    
    if (isCodeInClarificationList(formData.code)) {
      setCodeStatus({
        isValid: false,
        message: 'Código no disponible para registro',
        type: 'warning'
      });
      return false;
    }

    if (isCodeRegistered(formData.code)) {
      setCodeStatus({
        isValid: false,
        message: 'El código ya fue registrado antes',
        type: 'error'
      });
      return false;
    }
    
    setCodeStatus({
      isValid: true,
      message: 'Código disponible para registro',
      type: 'success'
    });
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.lastName.trim() || !formData.code.trim() || !formData.faculty || !formData.phone.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!formData.route) {
      setError('Por favor selecciona una ruta');
      return;
    }

    if (isCodeInClarificationList(formData.code)) {
      setError('No se pudo registrar. Por favor ponte en contacto con tu delegado/a.');
      return;
    }

    const routeConfig = state.routes[formData.route];
    if (!routeConfig.isActive) {
      setError(`La ruta ${routeConfig.name} está inactiva`);
      return;
    }

    const routeStudents = state.students.filter(s => s.route === formData.route);
    if (routeStudents.length >= routeConfig.capacity) {
      setError(`La ruta ${routeConfig.name} está llena`);
      return;
    }

    const student = registerStudent(formData);
    
    if (student) {
      onRegistrationSuccess(student);
      setFormData({
        name: '',
        lastName: '',
        code: '',
        faculty: '' as Faculty,
        route: '' as Route,
        phone: ''
      });
      setCodeStatus(null);
    } else {
      setError('No se pudo registrar. Verifica que el código no haya sido registrado previamente o que haya asientos disponibles.');
    }
  };

  const activeRoutes = getSortedRoutes()
    .filter(([, config]) => config.isActive);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Registro de Estudiantes</h2>
      
      {error && (
        <div className={`${isCodeInClarificationList(formData.code) ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500' : 'bg-red-50 dark:bg-red-900/30 border-red-500'} border-l-4 p-4 mb-6`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className={`h-5 w-5 ${isCodeInClarificationList(formData.code) ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`} />
            </div>
            <div className="ml-3">
              <p className={`text-sm ${isCodeInClarificationList(formData.code) ? 'text-yellow-700 dark:text-yellow-200' : 'text-red-700 dark:text-red-200'}`}>{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Ingresa tu nombre"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Apellido</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Código de Estudiante</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  onBlur={validateCode}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Ej. 20211234A"
                />
              </div>
              {codeStatus && (
                <p className={`mt-1 text-sm ${
                  codeStatus.type === 'success' ? 'text-green-600 dark:text-green-400' : 
                  codeStatus.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {codeStatus.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Celular</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Ej. 987654321"
                  pattern="[0-9]{9}"
                  maxLength={9}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Facultad</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <select
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300 dark:border-gray-600 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Selecciona tu facultad</option>
                  {FACULTIES.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Selección de Ruta</label>
            <div className="space-y-3">
              {activeRoutes.map(([route, config]) => {
                const routeStudents = state.students.filter(s => s.route === route);
                const isFull = routeStudents.length >= config.capacity;
                const routeColor = getRouteColor(route);
                
                return (
                  <div key={route} className="route-option">
                    <input
                      type="radio"
                      id={route.toLowerCase().replace(' ', '-')}
                      name="route"
                      value={route}
                      checked={formData.route === route}
                      onChange={() => handleRouteChange(route)}
                      className="hidden peer"
                      disabled={isFull}
                    />
                    <label
                      htmlFor={route.toLowerCase().replace(' ', '-')}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer
                        ${isFull ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-600' : 
                          formData.route === route ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
                          'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <div className="flex items-center">
                        <BusFront className="h-6 w-6 mr-2" style={{ color: routeColor }} />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{config.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{config.subtitle}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {routeStudents.length}/{config.capacity} cupos ocupados
                          </p>
                        </div>
                      </div>
                      
                      {isFull && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                          Llena
                        </span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;