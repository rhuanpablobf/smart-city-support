
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/chat';
import { fetchConversations } from '@/services/conversationService';
import { useConversationState } from './chat/useConversationState';
import { useConversationActions } from './chat/useConversationActions';
import { toast } from 'sonner';
import { supabase } from '@/services/base/supabaseBase';

export function useConversationManager() {
  const { authState } = useAuth();
  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    loading,
    setLoading,
    activeConversationsCount
  } = useConversationState();

  const {
    handleSendMessage,
    handleStartConversation,
    handleCloseConversation,
    handleTransferConversation
  } = useConversationActions();

  useEffect(() => {
    const loadConversations = async () => {
      if (!authState.isAuthenticated) return;
      
      try {
        setLoading(true);
        const data = await fetchConversations();
        setConversations(data);

        if (currentConversation) {
          const updated = data.find(c => c.id === currentConversation.id);
          if (updated) setCurrentConversation(updated);
          else if (currentConversation.status !== 'closed') {
            // If conversation was removed or status changed, reset current conversation
            setCurrentConversation(undefined);
          }
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Erro ao carregar conversas');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [authState.isAuthenticated]);

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleStartNewConversation = async () => {
    const newConversation = await handleStartConversation();
    if (newConversation) {
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      await handleSendMessage('Olá! Como posso ajudar?', newConversation.id);
      return newConversation;
    }
    return null;
  };

  const updateConversationStatus = async (conversationId: string) => {
    try {
      // Add system message about closing the conversation
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: 'Atendimento encerrado.',
          type: 'system',
          sender_id: 'system',
          sender_name: 'Sistema',
          sender_role: 'system',
          status: 'delivered'
        });
        
      // Update conversation status to closed and set closed_at timestamp
      const { data, error } = await supabase
        .from('conversations')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', conversationId)
        .select();
      
      if (error) {
        console.error('Error closing conversation:', error);
        toast.error('Erro ao encerrar atendimento');
        return null;
      }
      
      // Update state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, status: 'closed' } : conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(undefined);
      }
      
      toast.success('Atendimento encerrado');
      return data[0];
    } catch (error) {
      console.error('Error closing conversation:', error);
      toast.error('Erro ao encerrar atendimento');
      return null;
    }
  };

  const transferConversation = async (
    conversationId: string,
    targetAgentId: string,
    targetDepartmentId?: string
  ) => {
    try {
      // Add system message about transfer
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: 'Atendimento transferido.',
          type: 'system',
          sender_id: 'system',
          sender_name: 'Sistema',
          sender_role: 'system',
          status: 'delivered'
        });
      
      // Update conversation with new agent and department
      const updateData: any = { agent_id: targetAgentId };
      if (targetDepartmentId) {
        updateData.department_id = targetDepartmentId;
      }
      
      const { data, error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId)
        .select();
      
      if (error) {
        console.error('Error transferring conversation:', error);
        toast.error('Erro ao transferir atendimento');
        return null;
      }
      
      // Update state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { 
            ...conv, 
            agentId: targetAgentId,
            department: targetDepartmentId || conv.department
          } : conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(undefined);
      }
      
      toast.success('Atendimento transferido');
      return data[0];
    } catch (error) {
      console.error('Error transferring conversation:', error);
      toast.error('Erro ao transferir atendimento');
      return null;
    }
  };

  return {
    conversations,
    currentConversation,
    loading,
    activeConversationsCount,
    handleSendMessage,
    handleSelectConversation,
    handleStartConversation: handleStartNewConversation,
    handleCloseConversation: updateConversationStatus,
    handleTransferConversation: transferConversation
  };
}
