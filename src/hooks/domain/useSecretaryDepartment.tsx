
import { useState, useEffect, useMemo } from 'react';
import { UserRole, User } from '@/types/auth';
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';
import { fetchSecretaries, fetchDepartmentsBySecretary } from '@/services/unitsService';

export interface Secretary {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  secretary_id: string;
  // Add secretaryId as an alias for compatibility
  secretaryId?: string;
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
        
        // Fetch secretaries
        const secretariesData = await fetchSecretaries();
        setSecretaries(secretariesData);
        
        // Fetch all departments or filter by secretary_id if user is secretary_admin
        let departmentsData = [];
        
        if (isSecretaryAdmin && currentUserSecretaryId) {
          departmentsData = await fetchDepartmentsBySecretary(currentUserSecretaryId);
        } else {
          const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('name');
            
          if (error) {
            console.error('Error fetching all departments:', error);
            toast.error('Erro ao carregar departamentos');
          } else {
            departmentsData = data;
          }
        }
        
        // Map the departments data to our format, making sure to include both secretary_id and secretaryId
        const mappedDepartments = departmentsData.map((department: any) => ({
          id: department.id,
          name: department.name,
          secretary_id: department.secretary_id,
          secretaryId: department.secretary_id // Add this for compatibility
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
  }, [currentUserSecretaryId, isSecretaryAdmin]);

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
        return departments.filter(d => d.secretary_id === selectedSecretaryId);
      }
      return isSecretaryAdmin && currentUserSecretaryId 
        ? departments.filter(d => d.secretary_id === currentUserSecretaryId)
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
