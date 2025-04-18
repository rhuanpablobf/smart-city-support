
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/chat/DashboardContent';
import { useConversationManager } from '@/hooks/useConversationManager';

const Dashboard = () => {
  const { authState } = useAuth();
  const conversationManager = useConversationManager();

  const handleSendFile = async (file: File, conversationId?: string) => {
    // In a real app, this would upload the file to storage and then send a message with the file link
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

  return (
    <div className="container mx-auto h-full">
      <DashboardContent 
        chatOperationsProps={chatOperationsProps}
        currentUser={authState.user}
      />
    </div>
  );
};

export default Dashboard;
