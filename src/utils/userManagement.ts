
import { User, UserRole } from "@/types/auth";

// Mock departments and secretaries data for reuse
export const mockSecretaries = [
  { id: 'sec1', name: 'Secretaria de Saúde' },
  { id: 'sec2', name: 'Secretaria de Educação' },
  { id: 'sec3', name: 'Secretaria de Finanças' },
];

export const mockDepartments = [
  { id: 'dep1', name: 'Departamento de Consultas', secretaryId: 'sec1' },
  { id: 'dep2', name: 'Departamento de Vacinas', secretaryId: 'sec1' },
  { id: 'dep3', name: 'Departamento de Matrículas', secretaryId: 'sec2' },
  { id: 'dep4', name: 'Departamento de IPTU', secretaryId: 'sec3' },
];

// Helper functions for user management
export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrador Master';
    case 'secretary_admin':
      return 'Administrador de Secretaria';
    case 'manager':
      return 'Gerente';
    case 'agent':
      return 'Atendente';
    default:
      return 'Usuário';
  }
};

export const getRoleBadgeStyle = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'secretary_admin':
      return 'border-purple-200 bg-purple-50 text-purple-800';
    case 'manager':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    case 'agent':
      return 'border-green-200 bg-green-50 text-green-800';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-800';
  }
};

// Functions to determine available roles based on user's role
export const getAvailableRoles = (isAdmin: boolean, isSecretaryAdmin: boolean, isManager: boolean): UserRole[] => {
  if (isAdmin) {
    return ['admin', 'secretary_admin', 'manager', 'agent'];
  } else if (isSecretaryAdmin) {
    return ['manager', 'agent'];
  } else if (isManager) {
    return ['agent'];
  }
  return [];
};

// Check if user can add new users based on role
export const canAddUsers = (isAdmin: boolean, isSecretaryAdmin: boolean, isManager: boolean): boolean => {
  return isAdmin || isSecretaryAdmin || isManager;
};
