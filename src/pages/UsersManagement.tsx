
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { mockAgents } from '@/services/mockData';
import { User, UserRole } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import UsersList from '@/components/users/UsersList';
import UserFilters from '@/components/users/UserFilters';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import { 
  mockSecretaries, 
  mockDepartments, 
  getRoleName, 
  getRoleBadgeStyle,
  getAvailableRoles as getUserAvailableRoles,
  canAddUsers as checkCanAddUsers
} from '@/utils/userManagement';

const UsersManagement: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([...mockAgents]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [filterSecretaryId, setFilterSecretaryId] = useState<string | null>(null);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string | null>(null);
  
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

  const isAdmin = authState.user?.role === 'admin';
  const isSecretaryAdmin = authState.user?.role === 'secretary_admin';
  const isManager = authState.user?.role === 'manager';
  
  // Get available secretary options based on user role
  const availableSecretaries = useMemo(() => {
    if (isAdmin) {
      return mockSecretaries;
    } else if (isSecretaryAdmin && authState.user?.secretaryId) {
      return mockSecretaries.filter(s => s.id === authState.user?.secretaryId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, authState.user]);

  // Get available department options based on user role and selected secretary
  const availableDepartments = useMemo(() => {
    if (isAdmin || isSecretaryAdmin) {
      if (selectedSecretaryId) {
        return mockDepartments.filter(d => d.secretaryId === selectedSecretaryId);
      }
      return isSecretaryAdmin && authState.user?.secretaryId 
        ? mockDepartments.filter(d => d.secretaryId === authState.user?.secretaryId)
        : [];
    } else if (isManager && authState.user?.departmentId) {
      return mockDepartments.filter(d => d.id === authState.user?.departmentId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, isManager, selectedSecretaryId, authState.user]);

  // Filter users based on search query and user access level
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by secretary if user is not admin
    if (!isAdmin) {
      if (isSecretaryAdmin && authState.user?.secretaryId) {
        result = result.filter(user => user.secretaryId === authState.user?.secretaryId);
      } else if (isManager && authState.user?.departmentId) {
        result = result.filter(user => user.departmentId === authState.user?.departmentId && user.role === 'agent');
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
    authState.user,
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
    
    // Close dialog
    setIsAddDialogOpen(false);
    
    // Show success message
    toast.success('Usuário adicionado com sucesso');
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    
    // Update user
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === currentUser.id) {
          return currentUser;
        }
        return user;
      })
    );
    
    // Close dialog
    setIsEditDialogOpen(false);
    
    // Show success message
    toast.success('Usuário atualizado com sucesso');
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    // Remove user
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== currentUser.id)
    );
    
    // Close dialog
    setIsDeleteDialogOpen(false);
    
    // Show success message
    toast.success('Usuário removido com sucesso');
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setSelectedSecretaryId(user.secretaryId || null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
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

  // Get available roles for creating new users
  const getAvailableRoles = () => {
    return getUserAvailableRoles(isAdmin, isSecretaryAdmin, isManager);
  };

  // Check if user can add new users
  const canAddUsers = checkCanAddUsers(isAdmin, isSecretaryAdmin, isManager);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestão de Usuários</h1>
          <p className="text-gray-500">
            Adicione, edite ou remova usuários do sistema
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              className="pl-9 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {canAddUsers && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          )}
        </div>
      </div>

      {/* Filters Component */}
      <UserFilters
        isAdmin={isAdmin}
        mockSecretaries={mockSecretaries}
        mockDepartments={mockDepartments}
        filterSecretaryId={filterSecretaryId}
        filterDepartmentId={filterDepartmentId}
        handleSecretaryChange={handleSecretaryChange}
        handleDepartmentChange={handleDepartmentChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>
            Lista de todos os usuários registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersList
            users={filteredUsers}
            openEditDialog={openEditDialog}
            openDeleteDialog={openDeleteDialog}
            getRoleName={getRoleName}
            getRoleBadgeStyle={getRoleBadgeStyle}
          />
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <AddUserDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        handleAddUser={handleAddUser}
        getAvailableRoles={getAvailableRoles}
        getRoleName={getRoleName}
        availableSecretaries={availableSecretaries}
        availableDepartments={availableDepartments}
        selectedSecretaryId={selectedSecretaryId}
        handleSecretaryChange={handleSecretaryChange}
        handleDepartmentChange={handleDepartmentChange}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        currentUser={currentUser}
        handleEditUser={handleEditUser}
        getAvailableRoles={getAvailableRoles}
        getRoleName={getRoleName}
        availableSecretaries={availableSecretaries}
        isAdmin={isAdmin}
        isManager={isManager}
        mockDepartments={mockDepartments}
        updateCurrentUserSecretary={updateCurrentUserSecretary}
        updateCurrentUserDepartment={updateCurrentUserDepartment}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        currentUser={currentUser}
        handleDeleteUser={handleDeleteUser}
        getRoleName={getRoleName}
      />
    </div>
  );
};

export default UsersManagement;
