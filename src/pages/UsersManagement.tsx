
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UsersList from '@/components/users/UsersList';
import UserFilters from '@/components/users/UserFilters';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import { useUsers } from '@/hooks/useUsers';
import { 
  getRoleName, 
  getRoleBadgeStyle,
  canAddUsers
} from '@/utils/userManagement';

const UsersManagement: React.FC = () => {
  const { authState } = useAuth();
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
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen, 
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    openEditDialog,
    openDeleteDialog,
    handleSecretaryChange,
    handleDepartmentChange,
    updateCurrentUserSecretary,
    updateCurrentUserDepartment,
    availableSecretaries,
    availableDepartments,
    getUserAvailableRoles
  } = useUsers(
    authState.user?.role, 
    authState.user?.secretaryId, 
    authState.user?.departmentId
  );

  const isAdmin = authState.user?.role === 'admin';
  const isSecretaryAdmin = authState.user?.role === 'secretary_admin';
  const isManager = authState.user?.role === 'manager';

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
        mockSecretaries={availableSecretaries}
        mockDepartments={availableDepartments}
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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando usuários...</span>
            </div>
          ) : (
            <UsersList
              users={filteredUsers}
              openEditDialog={openEditDialog}
              openDeleteDialog={openDeleteDialog}
              getRoleName={getRoleName}
              getRoleBadgeStyle={getRoleBadgeStyle}
            />
          )}
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
        isSubmitting={isSubmitting}
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
        mockDepartments={availableDepartments}
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default UsersManagement;
