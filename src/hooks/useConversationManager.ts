
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/chat';
import { fetchConversations } from '@/services/conversationService';
import { useConversationState } from './chat/useConversationState';
import { useConversationActions } from './chat/useConversationActions';

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

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleStartNewConversation = async () => {
    const newConversation = await handleStartConversation();
    if (newConversation) {
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      await handleSendMessage('Olá! Como posso ajudar?', newConversation.id);
    }
  };

  const updateConversationStatus = async (conversationId: string) => {
    const result = await handleCloseConversation(conversationId);
    if (result) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, status: result.status } : conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => 
          prev ? { ...prev, status: result.status } : undefined
        );
      }
    }
  };

  const transferConversation = async (
    conversationId: string,
    targetAgentId: string,
    targetDepartmentId?: string
  ) => {
    const result = await handleTransferConversation(conversationId, targetAgentId, targetDepartmentId);
    if (result) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId ? { ...conv, ...result } : conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(undefined);
      }
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
