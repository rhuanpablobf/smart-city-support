
import React, { useEffect, useState } from 'react';
import ChatOperations from './ChatOperations';
import { useConversationManager } from '@/hooks/useConversationManager';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/chat';
import { supabase } from '@/services/base/supabaseBase';

const ChatInterface: React.FC = () => {
  const { authState } = useAuth();
  const conversationManager = useConversationManager();
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('secretaries')
          .select(`
            id,
            name,
            departments (
              id,
              name,
              services (
                id,
                name,
                description
              )
            )
          `)
          .order('name');
          
        if (error) {
          console.error('Error fetching departments:', error);
        } else if (data) {
          setDepartmentsData(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);

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
