
import { useState } from 'react';
import { User, UserRole } from '@/types/auth';
import { mockAgents } from '@/services/mockData';
import { toast } from 'sonner';
import { mockSecretaries, mockDepartments } from '@/utils/userManagement';

export function useUsersDomain(currentUserRole: UserRole | undefined, currentUserSecretaryId?: string | null, currentUserDepartmentId?: string | null) {
  const [users, setUsers] = useState<User[]>([...mockAgents]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role-based access control
  const isAdmin = currentUserRole === 'admin';
  const isSecretaryAdmin = currentUserRole === 'secretary_admin';
  const isManager = currentUserRole === 'manager';

  const handleAddUser = (newUser: Partial<User>) => {
    // Validate inputs
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error('Por favor, insira um email válido');
      return false;
    }

    // Validate secretary and department based on role
    if (newUser.role === 'secretary_admin' && !newUser.secretaryId) {
      toast.error('Administrador de secretaria precisa ter uma secretaria associada');
      return false;
    }

    if (newUser.role === 'manager' && (!newUser.secretaryId || !newUser.departmentId)) {
      toast.error('Gerente precisa ter secretaria e departamento associados');
      return false;
    }

    if (newUser.role === 'agent' && (!newUser.secretaryId || !newUser.departmentId)) {
      toast.error('Atendente precisa ter secretaria e departamento associados');
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get secretary and department names
      let secretaryName = null;
      let departmentName = null;
      
      if (newUser.secretaryId) {
        const secretary = mockSecretaries.find(s => s.id === newUser.secretaryId);
        secretaryName = secretary ? secretary.name : null;
      }
      
      if (newUser.departmentId) {
        const department = mockDepartments.find(d => d.id === newUser.departmentId);
        departmentName = department ? department.name : null;
      }
      
      // Admin always starts with offline status
      const isOfflineByDefault = newUser.role === 'admin';
      
      // Create new user
      const user: User = {
        id: `user${Date.now()}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as UserRole,
        isOnline: !isOfflineByDefault,
        status: isOfflineByDefault ? 'offline' : 'online',
        maxConcurrentChats: newUser.maxConcurrentChats || 5,
        secretaryId: newUser.secretaryId || null,
        secretaryName: secretaryName,
        departmentId: newUser.departmentId || null,
        departmentName: departmentName,
        avatar: '/placeholder.svg',
      };
      
      // Add user to list
      setUsers((prevUsers) => [...prevUsers, user]);
      
      // Show success message
      toast.success('Usuário adicionado com sucesso');
      
      return true;
    } catch (error) {
      toast.error('Erro ao adicionar usuário');
      console.error('Error adding user:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (currentUser: User | null) => {
    if (!currentUser) return false;
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!currentUser.name || !currentUser.email) {
        toast.error('Nome e email são campos obrigatórios');
        return false;
      }
      
      // Validate secretary selection for specific roles
      if ((currentUser.role === 'secretary_admin' || currentUser.role === 'manager' || currentUser.role === 'agent') 
          && !currentUser.secretaryId) {
        toast.error('Seleção de Secretaria é obrigatória para esta função');
        return false;
      }
      
      // Validate department selection for specific roles
      if ((currentUser.role === 'manager' || currentUser.role === 'agent') 
          && !currentUser.departmentId && currentUser.secretaryId) {
        toast.error('Seleção de Departamento é obrigatória para esta função');
        return false;
      }
      
      // Simulate API call delay (in a real app, this would be an actual API call)
      console.log('Saving user to database:', currentUser);
      
      // Update user in local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === currentUser.id) {
            return { ...currentUser };  // create a new object to ensure state updates
          }
          return user;
        })
      );
      
      toast.success('Usuário atualizado com sucesso');
      return true;
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
      console.error('Error updating user:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (currentUser: User | null) => {
    if (!currentUser) return false;
    
    setIsSubmitting(true);
    
    try {
      // Remove user from database (simulated)
      console.log('Deleting user from database:', currentUser.id);
      
      // Remove user from local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== currentUser.id)
      );
      
      // Show success message
      toast.success('Usuário removido com sucesso');
      return true;
    } catch (error) {
      toast.error('Erro ao remover usuário');
      console.error('Error deleting user:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter users based on access level and filters
  const getFilteredUsers = (searchQuery: string, filterSecretaryId: string | null, filterDepartmentId: string | null) => {
    let result = users;

    // Filter by secretary if user is not admin
    if (!isAdmin) {
      if (isSecretaryAdmin && currentUserSecretaryId) {
        result = result.filter(user => user.secretaryId === currentUserSecretaryId);
      } else if (isManager && currentUserDepartmentId) {
        result = result.filter(user => user.departmentId === currentUserDepartmentId && user.role === 'agent');
      } else {
        // Agents can't see other users
        return [];
      }
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply secretary filter
    if (filterSecretaryId) {
      result = result.filter(user => user.secretaryId === filterSecretaryId);
      
      // Apply department filter
      if (filterDepartmentId) {
        result = result.filter(user => user.departmentId === filterDepartmentId);
      }
    }

    return result;
  };

  return {
    users,
    isSubmitting,
    isAdmin,
    isSecretaryAdmin,
    isManager,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    getFilteredUsers
  };
}
