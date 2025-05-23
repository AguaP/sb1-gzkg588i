import React, { useState } from 'react';
import { Student, Faculty } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { X, Phone } from 'lucide-react';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
}

const FACULTIES: Faculty[] = [
  'FAUA', 'FC', 'FIA', 'FIC', 'FIEECS', 'FIEE', 'FIGMM', 'FIIS', 'FIM', 'FIP', 'FIQT'
];

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose }) => {
  const { updateStudent, isCodeRegistered } = useAppContext();
  const [formData, setFormData] = useState({
    name: student.name,
    lastName: student.lastName,
    code: student.code,
    faculty: student.faculty,
    phone: student.phone || ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!formData.name.trim() || !formData.lastName.trim() || !formData.code.trim() || !formData.faculty || !formData.phone.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Check if code is different and already registered
    if (formData.code !== student.code && isCodeRegistered(formData.code)) {
      setError('Este código ya está registrado por otro estudiante');
      return;
    }

    // Update student
    updateStudent({
      ...student,
      name: formData.name,
      lastName: formData.lastName,
      code: formData.code,
      faculty: formData.faculty as Faculty,
      phone: formData.phone
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Editar Estudiante</h2>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="px-6 pb-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 mb-4">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Código de Estudiante
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Celular
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  pattern="[0-9]{9}"
                  maxLength={9}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Facultad
              </label>
              <select
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {FACULTIES.map(faculty => (
                  <option key={faculty} value={faculty}>{faculty}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;