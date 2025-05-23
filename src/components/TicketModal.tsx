import React, { useRef, useEffect } from 'react';
import { Student } from '../types';
import { X, CheckCircle, CreditCard } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, student }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const getRouteBadgeColor = (route: string) => {
    switch (route) {
      case 'Norte': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'Puente Piedra': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'Este': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200';
      case 'Ate': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'Sur': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200';
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          ref={modalRef} 
          className="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-md animate-fade-in shadow-xl"
        >
          <div className="px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ticket de Reserva</h2>
              <button 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" 
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="px-8 pb-8 space-y-6">
            <div className="text-center py-4">
              <div className={`route-badge mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRouteBadgeColor(student.route)}`}>
                {student.route}
              </div>
              <div className="ticket-number text-5xl font-bold text-gray-800 dark:text-white">
                #{student.ticketNumber}
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Número de Ticket</p>
            </div>
            
            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                  <p className="font-medium text-gray-900 dark:text-white">{student.name} {student.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Código</p>
                  <p className="font-medium text-gray-900 dark:text-white">{student.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Facultad</p>
                  <p className="font-medium text-gray-900 dark:text-white">{student.faculty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{formatDate(student.timestamp)}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center mt-2">
                <CreditCard className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <p className="text-gray-700 dark:text-gray-300">Presentar carnet universitario o constancia de ingreso al subir</p>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                <p className="text-gray-700 dark:text-gray-300">Reserva confirmada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;