import { useState, useEffect, useMemo } from 'react';
import { UserRole, User } from '@/types/auth';
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';

export interface Secretary {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  secretaryId: string;
}

export function useSecretaryDepartment(
  currentUserRole?: UserRole,
  currentUserSecretaryId?: string | null,
  currentUserDepartmentId?: string | null
) {
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [filterSecretaryId, setFilterSecretaryId] = useState<string | null>(null);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string | null>(null);
  
  const [secretaries, setSecretaries] = useState<Secretary[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = currentUserRole === 'admin';
  const isSecretaryAdmin = currentUserRole === 'secretary_admin';
  const isManager = currentUserRole === 'manager';

  // Fetch secretaries and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch secretaries with proper typing
        const { data: secretariesData, error: secretariesError } = await supabase
          .from('secretaries')
          .select('*')
          .order('name');
        
        if (secretariesError) {
          console.error('Error fetching secretaries:', secretariesError);
          toast.error('Erro ao carregar secretarias');
          return;
        }
        
        // Map secretaries data
        const mappedSecretaries = secretariesData.map((secretary) => ({
          id: secretary.id,
          name: secretary.name
        }));
        
        setSecretaries(mappedSecretaries);
        
        // Fetch departments
        const { data: departmentsData, error: departmentsError } = await supabase
          .from('departments')
          .select('*')
          .order('name');
        
        if (departmentsError) {
          console.error('Error fetching departments:', departmentsError);
          toast.error('Erro ao carregar departamentos');
          return;
        }
        
        // Map departments data
        const mappedDepartments = departmentsData.map((department) => ({
          id: department.id,
          name: department.name,
          secretaryId: department.secretary_id
        }));
        
        setDepartments(mappedDepartments);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get available secretary options based on user role
  const availableSecretaries = useMemo(() => {
    if (isAdmin) {
      return secretaries;
    } else if (isSecretaryAdmin && currentUserSecretaryId) {
      return secretaries.filter(s => s.id === currentUserSecretaryId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, currentUserSecretaryId, secretaries]);

  // Get available department options based on user role and selected secretary
  const availableDepartments = useMemo(() => {
    if (isAdmin || isSecretaryAdmin) {
      if (selectedSecretaryId) {
        return departments.filter(d => d.secretaryId === selectedSecretaryId);
      }
      return isSecretaryAdmin && currentUserSecretaryId 
        ? departments.filter(d => d.secretaryId === currentUserSecretaryId)
        : [];
    } else if (isManager && currentUserDepartmentId) {
      return departments.filter(d => d.id === currentUserDepartmentId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, isManager, selectedSecretaryId, currentUserSecretaryId, currentUserDepartmentId, departments]);

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
      const secretary = secretaries.find(s => s.id === secretaryId);
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
      const department = departments.find(d => d.id === departmentId);
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
    updateUserDepartmentInfo,
    isLoading
  };
}
