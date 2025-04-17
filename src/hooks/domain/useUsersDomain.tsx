
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { fetchUsers, addUser, updateUser, deleteUser } from '@/api/userApi';
import { validateNewUser, validateUserEdit } from '@/utils/userValidationUtils';

export function useUsersDomain(
  currentUserRole: UserRole | undefined, 
  currentUserSecretaryId?: string | null, 
  currentUserDepartmentId?: string | null
) {
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Role-based access control
  const isAdmin = currentUserRole === 'admin';
  const isSecretaryAdmin = currentUserRole === 'secretary_admin';
  const isManager = currentUserRole === 'manager';

  // Fetch users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddUser = async (newUser: Partial<User>) => {
    const validation = validateNewUser(newUser);
    if (!validation.isValid) {
      toast.error(validation.message);
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const newUserData = await addUser(newUser);
      
      // Add user to list
      setUsers(prevUsers => [...prevUsers, newUserData]);
      
      // Show success message
      toast.success('Usuário adicionado com sucesso');
      
      return true;
    } catch (error) {
      console.error('Error in handleAddUser:', error);
      
      // Check for unique constraint violation (email already exists)
      if (error instanceof Error && error.message.includes('23505')) {
        toast.error('Email já cadastrado');
      } else {
        toast.error('Erro ao adicionar usuário');
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (currentUser: User | null) => {
    if (!currentUser) return false;
    
    setIsSubmitting(true);
    
    try {
      const validation = validateUserEdit(currentUser);
      if (!validation.isValid) {
        toast.error(validation.message);
        return false;
      }
      
      // Update user in Supabase
      await updateUser(currentUser);
      
      // Update user in local state
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === currentUser.id) {
            return { ...currentUser };
          }
          return user;
        })
      );
      
      toast.success('Usuário atualizado com sucesso');
      return true;
    } catch (error) {
      console.error('Error in handleEditUser:', error);
      
      // Check for unique constraint violation (email already exists)
      if (error instanceof Error && error.message.includes('23505')) {
        toast.error('Email já está em uso por outro usuário');
      } else {
        toast.error('Erro ao atualizar usuário');
      }
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (currentUser: User | null) => {
    if (!currentUser) return false;
    
    setIsSubmitting(true);
    
    try {
      // Delete user from Supabase
      await deleteUser(currentUser.id);
      
      // Remove user from local state
      setUsers(prevUsers =>
        prevUsers.filter(user => user.id !== currentUser.id)
      );
      
      toast.success('Usuário removido com sucesso');
      return true;
    } catch (error) {
      console.error('Error in handleDeleteUser:', error);
      toast.error('Erro ao remover usuário');
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
        user =>
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
    isLoading,
    isAdmin,
    isSecretaryAdmin,
    isManager,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    getFilteredUsers
  };
}
