
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/services/base/supabaseBase';

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
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('app_users')
          .select('*');

        if (error) {
          console.error('Error fetching users:', error);
          toast.error('Erro ao carregar usuários');
          return;
        }

        // Map Supabase data to our User type
        const mappedUsers: User[] = data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          isOnline: user.is_online,
          status: user.status,
          maxConcurrentChats: user.max_concurrent_chats,
          secretaryId: user.secretary_id,
          secretaryName: user.secretary_name,
          departmentId: user.department_id,
          departmentName: user.department_name,
          avatar: user.avatar || '/placeholder.svg',
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: Partial<User>) => {
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
      // Admin sempre inicia com status offline
      const isOfflineByDefault = newUser.role === 'admin';
      
      // Inserir usuário no Supabase
      const { data, error } = await supabase
        .from('app_users')
        .insert({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          is_online: !isOfflineByDefault,
          status: isOfflineByDefault ? 'offline' : 'online',
          max_concurrent_chats: newUser.maxConcurrentChats || 5,
          secretary_id: newUser.secretaryId,
          secretary_name: newUser.secretaryName,
          department_id: newUser.departmentId,
          department_name: newUser.departmentName,
          avatar: '/placeholder.svg',
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding user:', error);
        if (error.code === '23505') {
          toast.error('Email já cadastrado');
        } else {
          toast.error('Erro ao adicionar usuário');
        }
        return false;
      }

      // Map the returned data to our User type
      const newUserData: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        isOnline: data.is_online,
        status: data.status,
        maxConcurrentChats: data.max_concurrent_chats,
        secretaryId: data.secretary_id,
        secretaryName: data.secretary_name,
        departmentId: data.department_id,
        departmentName: data.department_name,
        avatar: data.avatar,
      };
      
      // Add user to list
      setUsers(prevUsers => [...prevUsers, newUserData]);
      
      // Show success message
      toast.success('Usuário adicionado com sucesso');
      
      return true;
    } catch (error) {
      console.error('Error in handleAddUser:', error);
      toast.error('Erro ao adicionar usuário');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (currentUser: User | null) => {
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
      
      // Update user in Supabase
      const { error } = await supabase
        .from('app_users')
        .update({
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          is_online: currentUser.isOnline,
          status: currentUser.status,
          max_concurrent_chats: currentUser.maxConcurrentChats,
          secretary_id: currentUser.secretaryId,
          secretary_name: currentUser.secretaryName,
          department_id: currentUser.departmentId,
          department_name: currentUser.departmentName,
        })
        .eq('id', currentUser.id);

      if (error) {
        console.error('Error updating user:', error);
        if (error.code === '23505') {
          toast.error('Email já está em uso por outro usuário');
        } else {
          toast.error('Erro ao atualizar usuário');
        }
        return false;
      }
      
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
      toast.error('Erro ao atualizar usuário');
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
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', currentUser.id);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Erro ao remover usuário');
        return false;
      }
      
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
