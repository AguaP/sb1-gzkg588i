import React, { useState } from 'react';
import { Route, RouteConfig } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { Settings, PlusCircle, AlertTriangle, GripVertical } from 'lucide-react';
import ConfirmationModal from '../ConfirmationModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface RouteConfigurationProps {
  onClose: () => void;
}

interface NewRouteForm {
  name: string;
  subtitle: string;
  capacity: number;
  isActive: boolean;
  color: string;
}

interface SortableRouteItemProps {
  route: Route;
  config: RouteConfig;
  isActive: boolean;
  onClick: () => void;
}

const SortableRouteItem: React.FC<SortableRouteItemProps> = ({ route, config, isActive, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: route });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center ${isDragging ? 'opacity-50' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button
        onClick={onClick}
        className={`flex-grow flex items-center px-3 py-2 text-sm font-medium rounded-md
          ${isActive 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
      >
        <span className="truncate">{config.name}</span>
        {!config.isActive && (
          <span className="ml-auto inline-block w-2 h-2 rounded-full bg-red-500"></span>
        )}
      </button>
    </div>
  );
};

const RouteConfiguration: React.FC<RouteConfigurationProps> = ({ onClose }) => {
  const { state, updateRouteConfig, addRoute, deleteRoute, reorderRoutes, getSortedRoutes, canDeleteRoute } = useAppContext();
  const [activeTab, setActiveTab] = useState<Route>('Norte');
  const [editingConfig, setEditingConfig] = useState<RouteConfig>(state.routes[activeTab]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showNewRouteForm, setShowNewRouteForm] = useState(false);
  const [newRouteData, setNewRouteData] = useState<NewRouteForm>({
    name: '',
    subtitle: '',
    capacity: 50,
    isActive: true,
    color: '#3B82F6'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedRoutes = getSortedRoutes();
  const routeIds = sortedRoutes.map(([route]) => route);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = routeIds.indexOf(active.id as Route);
      const newIndex = routeIds.indexOf(over.id as Route);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newRoutes = arrayMove(sortedRoutes, oldIndex, newIndex);
        newRoutes.forEach(([route], index) => {
          reorderRoutes(route, index);
        });
      }
    }
  };
  
  const handleTabClick = (route: Route) => {
    setActiveTab(route);
    setEditingConfig(state.routes[route]);
    setShowDeleteConfirmation(false);
    setShowNewRouteForm(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingConfig(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setEditingConfig(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setEditingConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewRouteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewRouteData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setNewRouteData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setNewRouteData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSave = () => {
    const updatedConfig = {
      ...editingConfig,
      color: editingConfig.color
    };
    updateRouteConfig(activeTab, updatedConfig);
  };

  const handleAddRoute = () => {
    if (!newRouteData.name.trim() || !newRouteData.subtitle.trim()) {
      return;
    }
    
    addRoute(newRouteData);
    setShowNewRouteForm(false);
    setNewRouteData({
      name: '',
      subtitle: '',
      capacity: 50,
      isActive: true,
      color: '#3B82F6'
    });
  };

  const handleDeleteRoute = () => {
    if (canDeleteRoute(activeTab)) {
      setShowDeleteConfirmation(true);
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  const handleConfirmDelete = () => {
    if (canDeleteRoute(activeTab)) {
      deleteRoute(activeTab);
      setActiveTab(Object.keys(state.routes)[0]);
      setShowDeleteConfirmation(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Configuración de Rutas
        </h3>
      </div>
      
      <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-700">
        <div className="sm:w-1/3 border-r border-gray-200 dark:border-gray-700">
          <nav className="space-y-1 p-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={routeIds}
                strategy={verticalListSortingStrategy}
              >
                {sortedRoutes.map(([route, config]) => (
                  <SortableRouteItem
                    key={route}
                    route={route}
                    config={config}
                    isActive={activeTab === route}
                    onClick={() => handleTabClick(route)}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            <button
              onClick={() => setShowNewRouteForm(true)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span className="truncate">Añadir Ruta</span>
            </button>
          </nav>
        </div>
        
        <div className="sm:w-2/3 p-6">
          {showNewRouteForm ? (
            <>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Nueva Ruta</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nombre de la Ruta
                  </label>
                  <input
                    type="text"
                    id="newName"
                    name="name"
                    value={newRouteData.name}
                    onChange={handleNewRouteInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Ej: Oeste"
                  />
                </div>
                
                <div>
                  <label htmlFor="newSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Descripción de la Ruta
                  </label>
                  <input
                    type="text"
                    id="newSubtitle"
                    name="subtitle"
                    value={newRouteData.subtitle}
                    onChange={handleNewRouteInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Ej: Plaza Oeste - UNI"
                  />
                </div>
                
                <div>
                  <label htmlFor="newCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    id="newCapacity"
                    name="capacity"
                    min="1"
                    max="200"
                    value={newRouteData.capacity}
                    onChange={handleNewRouteInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="newColor" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Color de la Ruta
                  </label>
                  <input
                    type="color"
                    id="newColor"
                    name="color"
                    value={newRouteData.color}
                    onChange={handleNewRouteInputChange}
                    className="block w-full h-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border bg-white dark:bg-gray-700"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newIsActive"
                    name="isActive"
                    checked={newRouteData.isActive}
                    onChange={handleNewRouteInputChange}
                    className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="newIsActive" className="text-sm text-gray-700 dark:text-gray-200">
                    Ruta activa
                  </label>
                </div>
                
                <div className="pt-4 space-x-3">
                  <button
                    onClick={handleAddRoute}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                  >
                    Añadir Ruta
                  </button>
                  <button
                    onClick={() => setShowNewRouteForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Configuración: {editingConfig.name}</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nombre de la Ruta
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editingConfig.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Ej: Norte"
                  />
                </div>
                
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Descripción de la Ruta
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={editingConfig.subtitle}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Ej: Plaza Norte - UNI"
                  />
                </div>
                
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    max="200"
                    value={editingConfig.capacity}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Establece el número máximo de estudiantes que pueden registrarse en esta ruta
                  </p>
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Color de la Ruta
                  </label>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={editingConfig.color}
                    onChange={handleInputChange}
                    className="block w-full h-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border bg-white dark:bg-gray-700"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={editingConfig.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-200">
                    Ruta activa
                  </label>
                </div>
                
                <div className="pt-4 space-y-4">
                  <button
                    onClick={handleSave}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                  >
                    Guardar Cambios
                  </button>
                  
                  <button
                    onClick={handleDeleteRoute}
                    className="w-full px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                  >
                    Eliminar Ruta
                  </button>
                </div>

                {!canDeleteRoute(activeTab) && showDeleteConfirmation && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          No se puede eliminar la ruta
                        </h3>
                        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                          Esta ruta tiene estudiantes registrados. Debes esperar a que no haya estudiantes en la ruta para poder eliminarla.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation && canDeleteRoute(activeTab)}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title={`Eliminar ruta ${editingConfig.name}`}
        message="¿Estás seguro de que deseas eliminar esta ruta? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
};

export default RouteConfiguration;