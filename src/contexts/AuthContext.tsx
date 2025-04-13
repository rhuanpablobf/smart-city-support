
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserStatus: (status: 'online' | 'offline' | 'break') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo with hierarchical structure
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin Master',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: false,
    status: 'offline' as const,
    maxConcurrentChats: 999,
    secretaryId: null,
    secretaryName: null,
    departmentId: null,
    departmentName: null,
  },
  {
    id: '2',
    name: 'Admin Secretaria Saúde',
    email: 'saude.admin@example.com',
    role: 'secretary_admin' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online' as const,
    maxConcurrentChats: 10,
    secretaryId: 'sec1',
    secretaryName: 'Secretaria de Saúde',
    departmentId: null,
    departmentName: null,
  },
  {
    id: '3',
    name: 'Gerente Consultas',
    email: 'consultas.gerente@example.com',
    role: 'manager' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online' as const,
    maxConcurrentChats: 7,
    secretaryId: 'sec1',
    secretaryName: 'Secretaria de Saúde',
    departmentId: 'dep1',
    departmentName: 'Departamento de Consultas',
  },
  {
    id: '4',
    name: 'Atendente Consultas',
    email: 'agent@example.com',
    role: 'agent' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online' as const,
    maxConcurrentChats: 5,
    secretaryId: 'sec1',
    secretaryName: 'Secretaria de Saúde',
    departmentId: 'dep1',
    departmentName: 'Departamento de Consultas',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is already authenticated (stored in localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - In real app, this would be an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user with provided email
      const user = MOCK_USERS.find(u => u.email === email);
      
      // Basic validation (in real app, would validate password too)
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Set default status based on role - admin always logs in as offline
      let initialStatus = user.role === 'admin' ? 'offline' : 'online';
      let initialIsOnline = user.role !== 'admin';
      
      const updatedUser = {
        ...user,
        status: initialStatus as 'online' | 'offline' | 'break',
        isOnline: initialIsOnline
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update auth state
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Show toast notification about login status
      if (user.role === 'admin') {
        toast.info('Administrador Master logado com status offline por padrão');
      } else {
        toast.success('Login efetuado com sucesso - Status online');
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    // Update auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUserStatus = (status: 'online' | 'offline' | 'break') => {
    if (!authState.user) return;
    
    const updatedUser = {
      ...authState.user,
      status,
      isOnline: status === 'online',
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update auth state
    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
