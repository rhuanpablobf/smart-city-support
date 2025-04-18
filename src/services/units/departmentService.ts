
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';
import { Department } from '@/services/units/types';

export const fetchDepartmentsBySecretary = async (secretaryId: string) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('secretary_id', secretaryId)
      .order('name');
    
    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
    
    return (data || []).map((dept: any) => ({
      ...dept,
      secretaryId: dept.secretary_id
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    toast.error('Erro ao carregar departamentos');
    return [];
  }
};

export const addDepartment = async (name: string, secretaryId: string) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert({ 
        name, 
        secretary_id: secretaryId 
      })
      .select();
    
    if (error) {
      console.error('Error adding department:', error);
      throw error;
    }
    
    toast.success('Unidade adicionada com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding department:', error);
    toast.error('Erro ao adicionar unidade');
    return null;
  }
};

export const updateDepartment = async (id: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .update({ name })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Unidade atualizada com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating department:', error);
    toast.error('Erro ao atualizar unidade');
    return null;
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Unidade removida com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    toast.error('Erro ao remover unidade');
    return false;
  }
};
