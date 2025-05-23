import React, { useState } from 'react';
import { Student, Route, Faculty } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { Check, X, Edit, Trash2, Search, Download, UserPlus, Trash, Heart } from 'lucide-react';
import EditStudentModal from './EditStudentModal';
import { generatePDF } from '../../utils/pdfGenerator';
import ConfirmationModal from '../ConfirmationModal';

interface StudentManagementProps {
  route: Route;
}

interface ManualRegistrationForm {
  name: string;
  lastName: string;
  code: string;
  faculty: Faculty | '';
  phone: string;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ route }) => {
  const { state, setStudentStatus, deleteStudent, registerStudentManually } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isSimplifiedView, setIsSimplifiedView] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [manualFormData, setManualFormData] = useState<ManualRegistrationForm>({
    name: '',
    lastName: '',
    code: '',
    faculty: '',
    phone: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  
  const filteredStudents = state.students
    .filter(student => student.route === route)
    .filter(student => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.code.toLowerCase().includes(term) ||
        student.phone.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => a.ticketNumber - b.ticketNumber);
  
  const handleSetStatus = (id: string, status: 'pending' | 'boarded' | 'no-show') => {
    setStudentStatus(id, status);
  };
  
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setStudentToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete);
      setStudentToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirmation(true);
  };

  const handleConfirmBulkDelete = () => {
    filteredStudents.forEach(student => deleteStudent(student.id));
  };
  
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };
  
  const handleExportPDF = () => {
    const routeConfig = state.routes[route];
    generatePDF(filteredStudents, routeConfig.name, routeConfig.subtitle);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!manualFormData.name.trim() || !manualFormData.lastName.trim() || 
        !manualFormData.code.trim() || !manualFormData.phone.trim() || !manualFormData.faculty) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    const success = registerStudentManually({
      ...manualFormData,
      faculty: manualFormData.faculty as Faculty,
      route
    });

    if (success) {
      setShowManualForm(false);
      setManualFormData({
        name: '',
        lastName: '',
        code: '',
        faculty: '',
        phone: ''
      });
    } else {
      setFormError('El código ya está registrado');
    }
  };
  
  const routeConfig = state.routes[route];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">
          {routeConfig.name} ({filteredStudents.length} estudiantes)
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex justify-end sm:justify-start gap-2">
            <button
              onClick={() => setShowManualForm(true)}
              title="Añadir estudiante"
              className="p-1.5 text-white bg-green-600 dark:bg-green-500 rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900"
            >
              <UserPlus className="h-4 w-4" />
            </button>

            {filteredStudents.length > 0 && (
              <>
                <button
                  onClick={handleBulkDelete}
                  title="Eliminar todos los registros"
                  className="p-1.5 text-white bg-red-600 dark:bg-red-500 rounded-md hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                >
                  <Trash className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setIsSimplifiedView(!isSimplifiedView)}
                  title={isSimplifiedView ? "Vista completa" : "Vista simplificada"}
                  className={`p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-900 ${
                    isSimplifiedView 
                      ? 'text-white bg-pink-600 dark:bg-pink-500 hover:bg-pink-700 dark:hover:bg-pink-600' 
                      : 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Añadir Estudiante Manualmente</h3>
              <button onClick={() => setShowManualForm(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-sm text-red-700 dark:text-red-200">{formError}</p>
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={manualFormData.name}
                  onChange={handleManualInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={manualFormData.lastName}
                  onChange={handleManualInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Código</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={manualFormData.code}
                  onChange={handleManualInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Celular</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={manualFormData.phone}
                  onChange={handleManualInputChange}
                  pattern="[0-9]{9}"
                  maxLength={9}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Facultad</label>
                <select
                  id="faculty"
                  name="faculty"
                  value={manualFormData.faculty}
                  onChange={handleManualInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Selecciona tu facultad</option>
                  {Object.values(state.routes).map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {filteredStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estudiante
                </th>
                {!isSimplifiedView && (
                  <>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Código
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Celular
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Facultad
                    </th>
                  </>
                )}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                {!isSimplifiedView && (
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2.5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {student.ticketNumber}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.name} {student.lastName}
                    </div>
                  </td>
                  {!isSimplifiedView && (
                    <>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.code}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.phone}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.faculty}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSetStatus(student.id, 'boarded')}
                        className={`p-1 rounded-full ${
                          student.status === 'boarded' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title="Subió al bus"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => handleSetStatus(student.id, 'no-show')}
                        className={`p-1 rounded-full ${
                          student.status === 'no-show' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title="No subió al bus"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                  {!isSimplifiedView && (
                    <td className="px-4 py-2.5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteClick(student.id)}
                          className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay estudiantes registrados en esta ruta
        </div>
      )}
      
      {isEditModalOpen && editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={handleEditModalClose}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar registro"
        message="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showBulkDeleteConfirmation}
        onClose={() => setShowBulkDeleteConfirmation(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Eliminar todos los registros de ${routeConfig.name}`}
        message="¿Estás seguro de que deseas eliminar TODOS los registros de esta ruta? Esta acción no se puede deshacer."
        confirmText="Eliminar todos"
        type="danger"
      />
    </div>
  );
};

export default StudentManagement;