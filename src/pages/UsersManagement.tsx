
import React, { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import UsersList from '@/components/users/UsersList';
import UserFilters from '@/components/users/UserFilters';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import { useUsers } from '@/hooks/useUsers';
import { 
  mockSecretaries, 
  mockDepartments, 
  getRoleName, 
  getRoleBadgeStyle,
  getAvailableRoles,
  canAddUsers
} from '@/utils/userManagement';

const UsersManagement: React.FC = () => {
  const { authState } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    currentUser,
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
  } = useUsers(
    authState.user?.role, 
    authState.user?.secretaryId, 
    authState.user?.departmentId
  );

  const isAdmin = authState.user?.role === 'admin';
  const isSecretaryAdmin = authState.user?.role === 'secretary_admin';
  const isManager = authState.user?.role === 'manager';

  // Get available secretary options based on user role
  const availableSecretaries = React.useMemo(() => {
    if (isAdmin) {
      return mockSecretaries;
    } else if (isSecretaryAdmin && authState.user?.secretaryId) {
      return mockSecretaries.filter(s => s.id === authState.user?.secretaryId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, authState.user]);

  // Get available department options based on user role and selected secretary
  const availableDepartments = React.useMemo(() => {
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

  // Get available roles for creating new users
  const getUserAvailableRoles = () => {
    return getAvailableRoles(isAdmin, isSecretaryAdmin, isManager);
  };

  // Check if user can add new users
  const userCanAddUsers = canAddUsers(isAdmin, isSecretaryAdmin, isManager);

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

          {userCanAddUsers && (
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
        getAvailableRoles={getUserAvailableRoles}
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
        getAvailableRoles={getUserAvailableRoles}
        getRoleName={getRoleName}
        availableSecretaries={availableSecretaries}
        isAdmin={isAdmin}
        isManager={isManager}
        mockDepartments={mockDepartments}
        updateCurrentUserSecretary={updateCurrentUserSecretary}
        updateCurrentUserDepartment={updateCurrentUserDepartment}
        isSubmitting={isSubmitting}
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
