
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';
import { QuestionAnswer } from '@/services/units/types';

export const fetchQuestionsByService = async (serviceId: string) => {
  try {
    const { data, error } = await supabase
      .from('questions_answers')
      .select('*')
      .eq('service_id', serviceId)
      .order('id');
    
    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    toast.error('Erro ao carregar perguntas e respostas');
    return [];
  }
};

export const addQuestionAnswer = async (serviceId: string, question: string, answer: string) => {
  try {
    const { data, error } = await supabase
      .from('questions_answers')
      .insert({ 
        service_id: serviceId,
        question,
        answer 
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Pergunta e resposta adicionadas com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding question/answer:', error);
    toast.error('Erro ao adicionar pergunta e resposta');
    return null;
  }
};

export const updateQuestionAnswer = async (id: string, question: string, answer: string) => {
  try {
    const { data, error } = await supabase
      .from('questions_answers')
      .update({ 
        question,
        answer 
      })
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Pergunta e resposta atualizadas com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error updating question/answer:', error);
    toast.error('Erro ao atualizar pergunta e resposta');
    return null;
  }
};

export const deleteQuestionAnswer = async (id: string) => {
  try {
    const { error } = await supabase
      .from('questions_answers')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Pergunta e resposta removidas com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting question/answer:', error);
    toast.error('Erro ao remover pergunta e resposta');
    return false;
  }
};
