
import { useState, useMemo } from 'react';
import { UserRole, User } from '@/types/auth';
import { mockSecretaries, mockDepartments } from '@/utils/userManagement';

export function useSecretaryDepartment(
  currentUserRole?: UserRole,
  currentUserSecretaryId?: string | null,
  currentUserDepartmentId?: string | null
) {
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [filterSecretaryId, setFilterSecretaryId] = useState<string | null>(null);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string | null>(null);

  const isAdmin = currentUserRole === 'admin';
  const isSecretaryAdmin = currentUserRole === 'secretary_admin';
  const isManager = currentUserRole === 'manager';

  // Get available secretary options based on user role
  const availableSecretaries = useMemo(() => {
    if (isAdmin) {
      return mockSecretaries;
    } else if (isSecretaryAdmin && currentUserSecretaryId) {
      return mockSecretaries.filter(s => s.id === currentUserSecretaryId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, currentUserSecretaryId]);

  // Get available department options based on user role and selected secretary
  const availableDepartments = useMemo(() => {
    if (isAdmin || isSecretaryAdmin) {
      if (selectedSecretaryId) {
        return mockDepartments.filter(d => d.secretaryId === selectedSecretaryId);
      }
      return isSecretaryAdmin && currentUserSecretaryId 
        ? mockDepartments.filter(d => d.secretaryId === currentUserSecretaryId)
        : [];
    } else if (isManager && currentUserDepartmentId) {
      return mockDepartments.filter(d => d.id === currentUserDepartmentId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, isManager, selectedSecretaryId, currentUserSecretaryId, currentUserDepartmentId]);

  const handleSecretaryChange = (value: string, isFilter = false) => {
    if (isFilter) {
      setFilterSecretaryId(value || null);
      setFilterDepartmentId(null); // Reset department filter when secretary changes
    } else {
      setSelectedSecretaryId(value || null);
    }
    return value || null;
  };

  const handleDepartmentChange = (value: string, isFilter = false) => {
    if (isFilter) {
      setFilterDepartmentId(value || null);
    }
    return value || null;
  };

  const updateUserDepartmentInfo = (user: Partial<User>, secretaryId: string | null = null, departmentId: string | null = null) => {
    if (!user) return user;

    let updatedUser = { ...user };
    
    // Update secretary info
    if (secretaryId !== undefined && secretaryId !== null) {
      const secretary = mockSecretaries.find(s => s.id === secretaryId);
      updatedUser.secretaryId = secretaryId;
      updatedUser.secretaryName = secretary ? secretary.name : null;
      
      // If secretary changes, reset department
      if (secretaryId !== user.secretaryId) {
        updatedUser.departmentId = null;
        updatedUser.departmentName = null;
      }
    }
    
    // Update department info
    if (departmentId !== undefined && departmentId !== null) {
      const department = mockDepartments.find(d => d.id === departmentId);
      updatedUser.departmentId = departmentId;
      updatedUser.departmentName = department ? department.name : null;
    }
    
    return updatedUser;
  };

  return {
    selectedSecretaryId,
    setSelectedSecretaryId,
    filterSecretaryId,
    filterDepartmentId,
    availableSecretaries,
    availableDepartments,
    handleSecretaryChange,
    handleDepartmentChange,
    updateUserDepartmentInfo
  };
}
