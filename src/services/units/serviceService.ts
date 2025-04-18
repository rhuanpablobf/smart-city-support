
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';
import { Service } from '@/services/units/types';

export const fetchServicesByDepartment = async (departmentId: string) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('department_id', departmentId)
      .order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    toast.error('Erro ao carregar serviços');
    return [];
  }
};

export const addService = async (name: string, departmentId: string, description: string | null = null) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({ 
        name, 
        department_id: departmentId,
        description 
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Serviço adicionado com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding service:', error);
    toast.error('Erro ao adicionar serviço');
    return null;
  }
};

export const updateService = async (id: string, name: string, description: string | null = null) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({ 
        name,
        description 
      })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Serviço atualizado com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating service:', error);
    toast.error('Erro ao atualizar serviço');
    return null;
  }
};

export const deleteService = async (id: string) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Serviço removido com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    toast.error('Erro ao remover serviço');
    return false;
  }
};
