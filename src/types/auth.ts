export type UserRole = 'admin' | 'secretary_admin' | 'manager' | 'agent' | 'user' | 'system';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  maxConcurrentChats: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}
