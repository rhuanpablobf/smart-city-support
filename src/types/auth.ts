
export type UserRole = 'admin' | 'secretary_admin' | 'manager' | 'agent' | 'user' | 'system';
export type UserStatus = 'online' | 'offline' | 'break';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  maxConcurrentChats: number;
  // Add missing properties that are causing type errors
  avatar?: string;
  isOnline?: boolean;
  status?: UserStatus;
  secretaryId?: string | null;
  secretaryName?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}
