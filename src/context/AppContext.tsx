import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Route, RouteConfig, AppState, Faculty, Clarification } from '../types';

export const RouteColors: Record<string, string> = {
  'Norte': '#3B82F6',
  'Puente Piedra': '#22C55E',
  'Este': '#F59E0B',
  'Ate': '#EF4444',
  'Sur': '#8B5CF6'
};

const defaultRouteConfigs: Record<Route, RouteConfig> = {
  'Norte': {
    id: 'norte',
    name: 'Norte',
    subtitle: 'Plaza Norte - UNI',
    isActive: true,
    capacity: 50,
    order: 0,
    color: RouteColors['Norte']
  },
  'Puente Piedra': {
    id: 'puente-piedra',
    name: 'Puente Piedra',
    subtitle: 'Plaza Puente Piedra - UNI',
    isActive: true,
    capacity: 50,
    order: 1,
    color: RouteColors['Puente Piedra']
  },
  'Este': {
    id: 'este',
    name: 'Este',
    subtitle: 'Metro Santa Anita - UNI',
    isActive: true,
    capacity: 50,
    order: 2,
    color: RouteColors['Este']
  },
  'Ate': {
    id: 'ate',
    name: 'Ate',
    subtitle: 'Mall de Ate - UNI',
    isActive: true,
    capacity: 50,
    order: 3,
    color: RouteColors['Ate']
  },
  'Sur': {
    id: 'sur',
    name: 'Sur',
    subtitle: 'Plaza Sur - UNI',
    isActive: true,
    capacity: 50,
    order: 4,
    color: RouteColors['Sur']
  }
};

const initialState: AppState = {
  students: [],
  routes: defaultRouteConfigs,
  clarifications: [],
  isAdmin: false,
  currentRoute: null
};

interface AppContextProps {
  state: AppState;
  registerStudent: (student: Omit<Student, 'id' | 'ticketNumber' | 'status' | 'timestamp'>) => Student | null;
  registerStudentManually: (student: Omit<Student, 'id' | 'ticketNumber' | 'status' | 'timestamp'>) => boolean;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  setStudentStatus: (id: string, status: 'pending' | 'boarded' | 'no-show') => void;
  login: (password: string) => boolean;
  logout: () => void;
  updateRouteConfig: (route: Route, config: Partial<RouteConfig>) => void;
  addRoute: (config: Omit<RouteConfig, 'id' | 'order'>) => void;
  deleteRoute: (route: Route) => void;
  reorderRoutes: (routeId: string, newOrder: number) => void;
  setCurrentRoute: (route: Route | null) => void;
  getNextTicketNumber: (route: Route) => number;
  isCodeRegistered: (code: string) => boolean;
  isCodeInClarificationList: (code: string) => boolean;
  getSortedRoutes: () => [Route, RouteConfig][];
  canDeleteRoute: (route: Route) => boolean;
  getRouteColor: (route: Route) => string;
  addClarification: (clarification: Omit<Clarification, 'id' | 'timestamp'>) => void;
  deleteClarification: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('busRegistrationState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...initialState,
        ...parsedState,
        clarifications: parsedState.clarifications || []
      };
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('busRegistrationState', JSON.stringify(state));
  }, [state]);

  const getRouteColor = (route: Route): string => {
    return state.routes[route]?.color || RouteColors[route] || '#3B82F6';
  };

  const registerStudent = (studentData: Omit<Student, 'id' | 'ticketNumber' | 'status' | 'timestamp'>) => {
    if (isCodeRegistered(studentData.code) || isCodeInClarificationList(studentData.code)) {
      return null;
    }

    const routeStudents = state.students.filter(s => s.route === studentData.route);
    if (routeStudents.length >= state.routes[studentData.route].capacity) {
      return null;
    }

    const ticketNumber = getNextTicketNumber(studentData.route);
    const newStudent: Student = {
      id: crypto.randomUUID(),
      ticketNumber,
      status: 'pending',
      timestamp: Date.now(),
      ...studentData
    };

    setState(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));

    return newStudent;
  };

  const registerStudentManually = (studentData: Omit<Student, 'id' | 'ticketNumber' | 'status' | 'timestamp'>) => {
    if (isCodeRegistered(studentData.code)) {
      return false;
    }

    const ticketNumber = getNextTicketNumber(studentData.route);
    const newStudent: Student = {
      id: crypto.randomUUID(),
      ticketNumber,
      status: 'pending',
      timestamp: Date.now(),
      ...studentData
    };

    setState(prev => ({
      ...prev,
      students: [...prev.students, newStudent]
    }));

    return true;
  };

  const updateStudent = (updatedStudent: Student) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    }));
  };

  const deleteStudent = (id: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.filter(student => student.id !== id)
    }));
  };

  const setStudentStatus = (id: string, status: 'pending' | 'boarded' | 'no-show') => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(student => 
        student.id === id ? { ...student, status } : student
      )
    }));
  };

  const login = (password: string) => {
    const isValid = password === 'Burrita2025@';
    if (isValid) {
      setState(prev => ({ ...prev, isAdmin: true }));
    }
    return isValid;
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAdmin: false }));
  };

  const updateRouteConfig = (route: Route, config: Partial<RouteConfig>) => {
    setState(prev => ({
      ...prev,
      routes: {
        ...prev.routes,
        [route]: { ...prev.routes[route], ...config }
      }
    }));
  };

  const addRoute = (config: Omit<RouteConfig, 'id' | 'order'>) => {
    const id = config.name.toLowerCase().replace(/\s+/g, '-');
    const maxOrder = Math.max(...Object.values(state.routes).map(r => r.order));
    
    setState(prev => ({
      ...prev,
      routes: {
        ...prev.routes,
        [config.name]: {
          ...config,
          id,
          order: maxOrder + 1
        }
      }
    }));
  };

  const deleteRoute = (route: Route) => {
    if (!canDeleteRoute(route)) {
      return;
    }

    const { [route]: deletedRoute, ...remainingRoutes } = state.routes;
    const deletedOrder = deletedRoute.order;

    Object.values(remainingRoutes).forEach(r => {
      if (r.order > deletedOrder) {
        r.order--;
      }
    });

    setState(prev => ({
      ...prev,
      routes: remainingRoutes
    }));
  };

  const canDeleteRoute = (route: Route): boolean => {
    return !state.students.some(student => student.route === route);
  };

  const reorderRoutes = (routeId: string, newOrder: number) => {
    const routes = { ...state.routes };
    const oldOrder = routes[routeId].order;

    Object.keys(routes).forEach(key => {
      const route = routes[key];
      if (oldOrder < newOrder) {
        if (route.order > oldOrder && route.order <= newOrder) {
          route.order--;
        }
      } else {
        if (route.order >= newOrder && route.order < oldOrder) {
          route.order++;
        }
      }
    });

    routes[routeId].order = newOrder;

    setState(prev => ({
      ...prev,
      routes
    }));
  };

  const setCurrentRoute = (route: Route | null) => {
    setState(prev => ({ ...prev, currentRoute: route }));
  };

  const getNextTicketNumber = (route: Route) => {
    const routeStudents = state.students.filter(student => student.route === route);
    return routeStudents.length > 0 
      ? Math.max(...routeStudents.map(s => s.ticketNumber)) + 1 
      : 1;
  };

  const isCodeRegistered = (code: string) => {
    return state.students.some(student => student.code === code);
  };

  const isCodeInClarificationList = (code: string) => {
    return state.clarifications.some(clarification => clarification.code === code);
  };

  const getSortedRoutes = () => {
    return Object.entries(state.routes)
      .sort(([, a], [, b]) => a.order - b.order);
  };

  const addClarification = (clarificationData: Omit<Clarification, 'id' | 'timestamp'>) => {
    const newClarification: Clarification = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...clarificationData
    };

    setState(prev => ({
      ...prev,
      clarifications: [newClarification, ...prev.clarifications]
    }));
  };

  const deleteClarification = (id: string) => {
    setState(prev => ({
      ...prev,
      clarifications: prev.clarifications.filter(c => c.id !== id)
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      registerStudent,
      registerStudentManually,
      updateStudent,
      deleteStudent,
      setStudentStatus,
      login,
      logout,
      updateRouteConfig,
      addRoute,
      deleteRoute,
      reorderRoutes,
      setCurrentRoute,
      getNextTicketNumber,
      isCodeRegistered,
      isCodeInClarificationList,
      getSortedRoutes,
      canDeleteRoute,
      getRouteColor,
      addClarification,
      deleteClarification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};