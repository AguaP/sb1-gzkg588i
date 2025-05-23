import React, { useRef, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  const getColorScheme = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-500 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
          background: 'bg-red-50 dark:bg-red-900/20'
        };
      case 'warning':
        return {
          icon: 'text-yellow-500 dark:text-yellow-400',
          button: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
          background: 'bg-yellow-50 dark:bg-yellow-900/20'
        };
      default:
        return {
          icon: 'text-red-500 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
          background: 'bg-red-50 dark:bg-red-900/20'
        };
    }
  };

  const colors = getColorScheme();

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md animate-fade-in shadow-xl"
        >
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className={`flex-shrink-0 ${colors.background} rounded-full p-2 mr-3`}>
                <AlertTriangle className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {message}
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900 ${colors.button}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;