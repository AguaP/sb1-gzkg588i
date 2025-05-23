import React, { useState } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import RegistrationDisplay from '../components/RegistrationDisplay';
import TicketModal from '../components/TicketModal';
import { Student } from '../types';
import { Bus, Lock, Moon, Sun } from 'lucide-react';

interface HomePageProps {
  onAdminClick: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAdminClick, isDark, onThemeToggle }) => {
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  const handleRegistrationSuccess = (student: Student) => {
    setRegisteredStudent(student);
    setIsTicketModalOpen(true);
  };
  
  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setRegisteredStudent(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Transporte UNI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
          <RegistrationDisplay />
          <TicketModal
            isOpen={isTicketModalOpen}
            onClose={handleCloseTicketModal}
            student={registeredStudent}
          />
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Atuni - Sistema de Registro para Buses </p>
          
          <button
            onClick={onAdminClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            <Lock className="h-4 w-4 mr-1" />
            Administración
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;