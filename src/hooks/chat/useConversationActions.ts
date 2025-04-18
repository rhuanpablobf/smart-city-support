
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/chat';
import { createConversation } from '@/services/conversationService';
import { sendMessage } from '@/services/messageService';
import { toast } from 'sonner';
import { supabase } from '@/services/base/supabaseBase';

export function useConversationActions() {
  const { authState } = useAuth();

  const handleSendMessage = async (messageContent: string, conversationId?: string) => {
    if (!conversationId) return;
    try {
      if (!authState.user) throw new Error('User not authenticated');
      await sendMessage(messageContent, conversationId, authState.user);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartConversation = async () => {
    try {
      if (!authState.user) throw new Error('User not authenticated');
      
      const newConversation = await createConversation(
        'Novo atendimento',
        undefined,
        undefined,
        undefined,
        authState.user,
        false
      );
      
      return newConversation;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };

  const handleCloseConversation = async (conversationId: string) => {
    try {
      // Update the conversation status in the database
      const { error } = await supabase
        .from('conversations')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', conversationId);
      
      if (error) {
        console.error('Error closing conversation:', error);
        toast.error('Erro ao encerrar conversa');
        return null;
      }
      
      toast.success('Conversa encerrada com sucesso');
      return { conversationId, status: 'closed' as const };
    } catch (error) {
      console.error('Error closing conversation:', error);
      toast.error('Erro ao encerrar conversa');
      return null;
    }
  };

  const handleTransferConversation = async (
    conversationId: string,
    targetAgentId: string,
    targetDepartmentId?: string
  ) => {
    try {
      let updateData = {};
      
      if (targetAgentId) {
        updateData = { 
          agent_id: targetAgentId,
          status: 'active'
        };
      } else if (targetDepartmentId) {
        updateData = { 
          agent_id: null,
          department_id: targetDepartmentId,
          status: 'waiting'
        };
      }
      
      const { error, data } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId)
        .select()
        .single();
        
      if (error) {
        console.error('Error transferring conversation:', error);
        toast.error('Erro ao transferir conversa');
        return null;
      }
      
      toast.success('Conversa transferida com sucesso');
      
      if (targetAgentId) {
        return { conversationId, agentId: targetAgentId };
      } else if (targetDepartmentId) {
        return { 
          conversationId, 
          agentId: undefined, 
          status: 'waiting' as const, 
          department: targetDepartmentId 
        };
      }
    } catch (error) {
      console.error('Error transferring conversation:', error);
      toast.error('Erro ao transferir conversa');
      return null;
    }
  };

  return {
    handleSendMessage,
    handleStartConversation,
    handleCloseConversation,
    handleTransferConversation
  };
}
