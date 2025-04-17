
import { toast } from 'sonner';
import { User } from '@/types/auth';

/**
 * Validates new user input
 */
export function validateNewUser(user: Partial<User>): { isValid: boolean; message?: string } {
  // Validate required fields
  if (!user.name || !user.email || !user.role) {
    return { isValid: false, message: 'Por favor, preencha todos os campos obrigatórios' };
  }
  
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return { isValid: false, message: 'Por favor, insira um email válido' };
  }

  // Validate secretary and department based on role
  if (user.role === 'secretary_admin' && !user.secretaryId) {
    return { 
      isValid: false, 
      message: 'Administrador de secretaria precisa ter uma secretaria associada'
    };
  }

  if (user.role === 'manager' && (!user.secretaryId || !user.departmentId)) {
    return { 
      isValid: false, 
      message: 'Gerente precisa ter secretaria e departamento associados'
    };
  }

  if (user.role === 'agent' && (!user.secretaryId || !user.departmentId)) {
    return { 
      isValid: false, 
      message: 'Atendente precisa ter secretaria e departamento associados'
    };
  }

  return { isValid: true };
}

/**
 * Validates user edit input
 */
export function validateUserEdit(user: User): { isValid: boolean; message?: string } {
  // Validate required fields
  if (!user.name || !user.email) {
    return { isValid: false, message: 'Nome e email são campos obrigatórios' };
  }
  
  // Validate secretary selection for specific roles
  if ((user.role === 'secretary_admin' || user.role === 'manager' || user.role === 'agent') 
      && !user.secretaryId) {
    return { 
      isValid: false, 
      message: 'Seleção de Secretaria é obrigatória para esta função'
    };
  }
  
  // Validate department selection for specific roles
  if ((user.role === 'manager' || user.role === 'agent') 
      && !user.departmentId && user.secretaryId) {
    return { 
      isValid: false, 
      message: 'Seleção de Departamento é obrigatória para esta função'
    };
  }

  return { isValid: true };
}
