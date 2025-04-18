
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/chat';
import { fetchConversations, createConversation, subscribeToConversations } from '@/services/conversationService';
import { sendMessage } from '@/services/messageService';
import { toast } from 'sonner';

export function useConversationManager() {
  const { authState } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>();
  const [loading, setLoading] = useState(true);

  // Count active conversations for this agent
  const activeConversationsCount = conversations.filter(
    conv => conv.status === 'active' && conv.agentId === authState.user?.id
  ).length;

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
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, currentConversation?.id]);

  const handleSendMessage = async (messageContent: string, conversationId?: string) => {
    if (!conversationId && !currentConversation) return;
    
    const targetConvId = conversationId || currentConversation!.id;
    
    try {
      if (!authState.user) throw new Error('User not authenticated');
      await sendMessage(messageContent, targetConvId, authState.user);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
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
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      
      await sendMessage(
        'Olá! Como posso ajudar?',
        newConversation.id,
        authState.user
      );
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleCloseConversation = async (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, status: 'closed' } : conv
      )
    );
    
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev => 
        prev ? { ...prev, status: 'closed' } : undefined
      );
    }
    
    toast.success('Conversa encerrada com sucesso');
  };

  const handleTransferConversation = async (
    conversationId: string,
    targetAgentId: string,
    targetDepartmentId?: string
  ) => {
    if (targetAgentId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, agentId: targetAgentId } : conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(undefined);
      }
      
      toast.success('Conversa transferida para outro atendente');
    } else if (targetDepartmentId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? 
          { ...conv, agentId: undefined, status: 'waiting', department: targetDepartmentId } : 
          conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(undefined);
      }
      
      toast.success('Conversa transferida para outro departamento');
    }
  };

  return {
    conversations,
    currentConversation,
    loading,
    activeConversationsCount,
    handleSendMessage,
    handleSelectConversation,
    handleStartConversation,
    handleCloseConversation,
    handleTransferConversation
  };
}
