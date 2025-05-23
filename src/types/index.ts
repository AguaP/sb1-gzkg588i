export interface Student {
  id: string;
  name: string;
  lastName: string;
  code: string;
  faculty: Faculty;
  route: Route;
  ticketNumber: number;
  status: 'pending' | 'boarded' | 'no-show';
  timestamp: number;
  phone: string;
}

export interface Clarification {
  id: string;
  name: string;
  lastName: string;
  code: string;
  phone: string;
  reason: string;
  timestamp: number;
}

export type Faculty = 
  | 'FAUA' 
  | 'FC' 
  | 'FIA' 
  | 'FIC' 
  | 'FIEECS' 
  | 'FIEE' 
  | 'FIGMM' 
  | 'FIIS' 
  | 'FIM' 
  | 'FIP' 
  | 'FIQT';

export type Route = string;

export interface RouteConfig {
  id: string;
  name: string;
  subtitle: string;
  isActive: boolean;
  capacity: number;
  order: number;
  color: string;
}

export interface AppState {
  students: Student[];
  routes: Record<Route, RouteConfig>;
  clarifications: Clarification[];
  isAdmin: boolean;
  currentRoute: Route | null;
}