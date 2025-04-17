
export type UserRole = 'admin' | 'manager' | 'agent' | 'user' | 'secretary_admin';

// Update the status type to match what's coming from the database
export type UserStatus = 'online' | 'offline' | 'break';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isOnline?: boolean;
  status?: UserStatus;
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
