
import React from 'react';
import ChatOperations from './ChatOperations';
import { useConversationManager } from '@/hooks/useConversationManager';
import { useAuth } from '@/contexts/AuthContext';

const ChatInterface = () => {
  const { authState } = useAuth();
  const conversationManager = useConversationManager();

  const handleSendFile = async (file: File, conversationId?: string) => {
    console.log('Send file:', file, 'to conversation:', conversationId || conversationManager.currentConversation?.id);
  };

  const chatOperationsProps = {
    conversations: conversationManager.conversations,
    currentConversation: conversationManager.currentConversation,
    currentUser: authState.user,
    loading: conversationManager.loading,
    activeConversationsCount: conversationManager.activeConversationsCount,
    onSelectConversation: conversationManager.handleSelectConversation,
    onStartNewConversation: conversationManager.handleStartConversation,
    onSendMessage: conversationManager.handleSendMessage,
    onSendFile: handleSendFile,
    onCloseConversation: conversationManager.handleCloseConversation,
    onTransferConversation: conversationManager.handleTransferConversation
  };

  return <ChatOperations {...chatOperationsProps} />;
};

export default ChatInterface;
