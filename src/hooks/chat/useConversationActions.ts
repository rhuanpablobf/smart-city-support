
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/chat';
import { createConversation } from '@/services/conversationService';
import { sendMessage } from '@/services/messageService';
import { toast } from 'sonner';

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
    toast.success('Conversa encerrada com sucesso');
    return { conversationId, status: 'closed' as const };
  };

  const handleTransferConversation = async (
    conversationId: string,
    targetAgentId: string,
    targetDepartmentId?: string
  ) => {
    if (targetAgentId) {
      toast.success('Conversa transferida para outro atendente');
      return { conversationId, agentId: targetAgentId };
    } else if (targetDepartmentId) {
      toast.success('Conversa transferida para outro departamento');
      return { 
        conversationId, 
        agentId: undefined, 
        status: 'waiting' as const, 
        department: targetDepartmentId 
      };
    }
  };

  return {
    handleSendMessage,
    handleStartConversation,
    handleCloseConversation,
    handleTransferConversation
  };
}
