
import { useState, useMemo } from 'react';
import { User, UserRole } from '@/types/auth';
import { useUsersDomain } from './domain/useUsersDomain';
import { useSecretaryDepartment } from './domain/useSecretaryDepartment';
import { getAvailableRoles } from '@/utils/userManagement';

export function useUsers(currentUserRole: UserRole | undefined, currentUserSecretaryId?: string | null, currentUserDepartmentId?: string | null) {
  // Domain logic
  const {
    users,
    isSubmitting,
    isAdmin,
    isSecretaryAdmin,
    isManager,
    handleAddUser: addUser,
    handleEditUser: editUser,
    handleDeleteUser: deleteUser,
    getFilteredUsers
  } = useUsersDomain(currentUserRole, currentUserSecretaryId, currentUserDepartmentId);

  // Secretary and department management
  const {
    selectedSecretaryId,
    setSelectedSecretaryId,
    filterSecretaryId,
    filterDepartmentId,
    availableSecretaries,
    availableDepartments,
    handleSecretaryChange,
    handleDepartmentChange,
    updateUserDepartmentInfo
  } = useSecretaryDepartment(currentUserRole, currentUserSecretaryId, currentUserDepartmentId);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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

  // Computed values
  const filteredUsers = useMemo(() => 
    getFilteredUsers(searchQuery, filterSecretaryId, filterDepartmentId),
    [searchQuery, filterSecretaryId, filterDepartmentId, users, isAdmin, isSecretaryAdmin, isManager]
  );

  // Action handlers
  const handleAddUser = () => {
    const success = addUser(newUser);
    if (success) {
      setIsAddDialogOpen(false);
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
    }
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    const success = editUser(currentUser);
    if (success) {
      setIsEditDialogOpen(false);
      setCurrentUser(null);
    }
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    const success = deleteUser(currentUser);
    if (success) {
      setIsDeleteDialogOpen(false);
      setCurrentUser(null);
    }
  };

  const openEditDialog = (user: User) => {
    // Create a deep copy of the user to prevent unintended state mutations
    setCurrentUser(JSON.parse(JSON.stringify(user)));
    setSelectedSecretaryId(user.secretaryId || null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(JSON.parse(JSON.stringify(user)));
    setIsDeleteDialogOpen(true);
  };

  // Fixed type definition to match the expected usage in UsersManagement.tsx
  const updateNewUserField = (field: keyof User, value: any) => {
    setNewUser(prev => {
      if (field === 'secretaryId') {
        return updateUserDepartmentInfo({ ...prev }, value, null);
      } else if (field === 'departmentId') {
        return updateUserDepartmentInfo({ ...prev }, prev.secretaryId, value);
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  // Fixed these two functions to properly handle type safety
  const updateCurrentUserSecretary = (value: string) => {
    if (!currentUser) return;
    const updatedUser = updateUserDepartmentInfo({ ...currentUser }, value, null);
    setCurrentUser(updatedUser as User); // Type assertion since we know currentUser is a full User
    setSelectedSecretaryId(value);
  };

  const updateCurrentUserDepartment = (value: string) => {
    if (!currentUser) return;
    const updatedUser = updateUserDepartmentInfo({ ...currentUser }, currentUser.secretaryId, value);
    setCurrentUser(updatedUser as User); // Type assertion since we know currentUser is a full User
  };

  // Get available roles for creating new users
  const getUserAvailableRoles = () => {
    return getAvailableRoles(isAdmin, isSecretaryAdmin, isManager);
  };

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    currentUser,
    setCurrentUser,
    newUser,
    setNewUser: updateNewUserField,
    selectedSecretaryId,
    filterSecretaryId,
    filterDepartmentId,
    isSubmitting,
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
  };
}
