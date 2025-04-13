
import { useState, useMemo } from 'react';
import { User, UserRole } from '@/types/auth';
import { mockAgents } from '@/services/mockData';
import { toast } from 'sonner';

export function useUsers(currentUserRole: UserRole | undefined, currentUserSecretaryId?: string | null, currentUserDepartmentId?: string | null) {
  const [users, setUsers] = useState<User[]>([...mockAgents]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSecretaryId, setFilterSecretaryId] = useState<string | null>(null);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string | null>(null);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'agent',
    secretaryId: null,
    secretaryName: null,
    departmentId: null,
    departmentName: null,
    maxConcurrentChats: 5,
  });

  const isAdmin = currentUserRole === 'admin';
  const isSecretaryAdmin = currentUserRole === 'secretary_admin';
  const isManager = currentUserRole === 'manager';
  
  // Filter users based on search query and user access level
  const filteredUsers = useMemo(() => {
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
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply secretary filter
    if (filterSecretaryId) {
      result = result.filter(user => user.secretaryId === filterSecretaryId);
      
      // Apply department filter
      if (filterDepartmentId) {
        result = result.filter(user => user.departmentId === filterDepartmentId);
      }
    }

    return result;
  }, [
    users,
    searchQuery,
    isAdmin,
    isSecretaryAdmin,
    isManager,
    currentUserSecretaryId,
    currentUserDepartmentId,
    filterSecretaryId,
    filterDepartmentId
  ]);
  
  const handleAddUser = () => {
    // Validate inputs
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    // Validate secretary and department based on role
    if (newUser.role === 'secretary_admin' && !newUser.secretaryId) {
      toast.error('Administrador de secretaria precisa ter uma secretaria associada');
      return;
    }

    if (newUser.role === 'manager' && (!newUser.secretaryId || !newUser.departmentId)) {
      toast.error('Gerente precisa ter secretaria e departamento associados');
      return;
    }

    if (newUser.role === 'agent' && (!newUser.secretaryId || !newUser.departmentId)) {
      toast.error('Atendente precisa ter secretaria e departamento associados');
      return;
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
      
      // Reset form
      setNewUser({
        name: '',
        email: '',
        role: 'agent',
        secretaryId: null,
        secretaryName: null,
        departmentId: null,
        departmentName: null,
        maxConcurrentChats: 5,
      });
      setSelectedSecretaryId(null);
      
      // Show success message
      toast.success('Usuário adicionado com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar usuário');
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
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
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    
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
    } catch (error) {
      toast.error('Erro ao remover usuário');
      console.error('Error deleting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (user: User) => {
    // Create a deep copy of the user to prevent unintended state mutations
    setCurrentUser(JSON.parse(JSON.stringify(user)));
    setSelectedSecretaryId(user.secretaryId || null);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(JSON.parse(JSON.stringify(user)));
  };

  const handleSecretaryChange = (value: string, isFilter = false) => {
    if (isFilter) {
      setFilterSecretaryId(value || null);
      setFilterDepartmentId(null); // Reset department filter when secretary changes
    } else {
      setSelectedSecretaryId(value || null);
      setNewUser({
        ...newUser,
        secretaryId: value || null,
        secretaryName: mockSecretaries.find(s => s.id === value)?.name || null,
        departmentId: null, // Reset department when secretary changes
        departmentName: null,
      });
    }
  };

  const handleDepartmentChange = (value: string, isFilter = false) => {
    if (isFilter) {
      setFilterDepartmentId(value || null);
    } else {
      setNewUser({
        ...newUser,
        departmentId: value || null,
        departmentName: mockDepartments.find(d => d.id === value)?.name || null,
      });
    }
  };

  const updateCurrentUserSecretary = (value: string) => {
    if (!currentUser) return;
    
    const secretary = mockSecretaries.find(s => s.id === value);
    setCurrentUser({
      ...currentUser,
      secretaryId: value,
      secretaryName: secretary ? secretary.name : null,
      departmentId: null, // Reset department when secretary changes
      departmentName: null,
    });
    setSelectedSecretaryId(value);
  };

  const updateCurrentUserDepartment = (value: string) => {
    if (!currentUser) return;
    
    const department = mockDepartments.find(d => d.id === value);
    setCurrentUser({
      ...currentUser,
      departmentId: value,
      departmentName: department ? department.name : null,
    });
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    currentUser,
    setCurrentUser,
    newUser,
    setNewUser,
    selectedSecretaryId,
    filterSecretaryId,
    filterDepartmentId,
    isSubmitting,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    openEditDialog,
    openDeleteDialog,
    handleSecretaryChange,
    handleDepartmentChange,
    updateCurrentUserSecretary,
    updateCurrentUserDepartment
  };
}

// Import the necessary utility functions from userManagement.ts
import { mockSecretaries, mockDepartments } from '@/utils/userManagement';
