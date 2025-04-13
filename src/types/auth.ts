
export type UserRole = 'admin' | 'manager' | 'agent' | 'user' | 'secretary_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isOnline?: boolean;
  status?: 'online' | 'offline' | 'break';
  maxConcurrentChats?: number;
  departmentId?: string;
  departmentName?: string;
  secretaryId?: string;
  secretaryName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
