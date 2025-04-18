
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';

export const fetchSecretaries = async () => {
  try {
    const { data, error } = await supabase
      .from('secretaries')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching secretaries:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching secretaries:', error);
    toast.error('Erro ao carregar secretarias');
    return [];
  }
};

export const addSecretary = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('secretaries')
      .insert({ name })
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding secretary:', error);
    toast.error('Erro ao adicionar secretaria');
    return null;
  }
};

export const updateSecretary = async (id: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('secretaries')
      .update({ name })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Secretaria atualizada com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating secretary:', error);
    toast.error('Erro ao atualizar secretaria');
    return null;
  }
};

export const deleteSecretary = async (id: string) => {
  try {
    const { error } = await supabase
      .from('secretaries')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Secretaria removida com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting secretary:', error);
    toast.error('Erro ao remover secretaria');
    return false;
  }
};
