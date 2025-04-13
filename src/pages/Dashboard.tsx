
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from '@/components/chat/ChatWindow';
import ConversationList from '@/components/chat/ConversationList';
import { Conversation } from '@/types/chat';
import { toast } from 'sonner';
import { 
  fetchConversations, 
  sendMessage, 
  subscribeToMessages, 
  subscribeToConversations,
  updateMessageStatus 
} from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(undefined);
  
  // Fetch conversations with React Query
  const { data: conversations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  // Local state to manage conversations with real-time updates
  const [localConversations, setLocalConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (conversations.length > 0) {
      setLocalConversations(conversations);
    }
  }, [conversations]);

  useEffect(() => {
    // Subscribe to conversation updates
    const unsubscribeFromConversations = subscribeToConversations((updatedConversation) => {
      setLocalConversations(prevConversations => {
        // Check if this is an update to an existing conversation
        const existingIndex = prevConversations.findIndex(c => c.id === updatedConversation.id);
        
        if (existingIndex >= 0) {
          // Update existing conversation
          const updatedConversations = [...prevConversations];
          updatedConversations[existingIndex] = {
            ...updatedConversations[existingIndex],
            ...updatedConversation,
          };
          return updatedConversations;
        } else if ('userName' in updatedConversation) { 
          // This is a complete new conversation
          return [...prevConversations, updatedConversation as Conversation];
        }
        
        return prevConversations;
      });
    });

    // Subscribe to message updates for the selected conversation
    let unsubscribeFromMessages: (() => void) | undefined;
    
    if (selectedConversation) {
      unsubscribeFromMessages = subscribeToMessages(
        selectedConversation.id,
        (newMessage) => {
          // Update both local conversations and selected conversation
          setLocalConversations(prevConversations => {
            return prevConversations.map(conv => {
              if (conv.id === newMessage.conversationId) {
                return {
                  ...conv,
                  lastMessageAt: newMessage.timestamp,
                  messages: [...conv.messages, newMessage]
                };
              }
              return conv;
            });
          });
          
          setSelectedConversation(prevConv => {
            if (prevConv?.id === newMessage.conversationId) {
              return {
                ...prevConv,
                lastMessageAt: newMessage.timestamp,
                messages: [...prevConv.messages, newMessage]
              };
            }
            return prevConv;
          });
          
          // If this message was from someone else to the current user, update status to read
          if (selectedConversation && 
              newMessage.conversationId === selectedConversation.id && 
              newMessage.senderId !== authState.user?.id) {
            updateMessageStatus(newMessage.id, 'read').catch(error => {
              console.error('Error updating message status:', error);
            });
          }
        }
      );
    }

    // Clean up subscriptions
    return () => {
      unsubscribeFromConversations();
      if (unsubscribeFromMessages) {
        unsubscribeFromMessages();
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar conversas');
      console.error('Error loading conversations:', error);
    }
  }, [error]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Mark messages as read when selecting a conversation
    if (conversation.messages.length > 0 && authState.user) {
      conversation.messages.forEach(message => {
        if (message.senderId !== authState.user?.id && message.status !== 'read') {
          updateMessageStatus(message.id, 'read').catch(error => {
            console.error('Error updating message status:', error);
          });
        }
      });
    }
  };

  const handleSendMessage = async (content: string, conversationId?: string) => {
    if (!content.trim() || !conversationId || !authState.user) return;
    
    try {
      await sendMessage(content, conversationId, authState.user);
      
      // No need to update local state, the subscription will handle it
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const handleSendFile = async (file: File, conversationId?: string) => {
    if (!conversationId || !authState.user) return;
    
    try {
      // In a real app, we'd upload the file to a storage service first
      toast.success(`Arquivo "${file.name}" enviado`);
      
      // For now, we'll just send a message with the file info
      await sendMessage(
        `Arquivo: ${file.name}`, 
        conversationId, 
        authState.user, 
        'file',
        '#', // Placeholder URL
        file.name
      );
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Erro ao enviar arquivo');
    }
  };

  const handleBackClick = () => {
    setSelectedConversation(undefined);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block md:w-80 lg:w-96 flex-shrink-0">
          <ConversationList
            conversations={localConversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        
        <div className={`flex-1 ${selectedConversation ? 'block' : 'hidden md:block'}`}>
          <ChatWindow
            conversation={selectedConversation}
            currentUser={authState.user}
            onSendMessage={handleSendMessage}
            onSendFile={handleSendFile}
            onBackClick={handleBackClick}
            loading={isLoading}
            showBackButton={true}
          />
        </div>
        
        <div className={`flex-1 md:hidden ${selectedConversation ? 'hidden' : 'block'}`}>
          <ConversationList
            conversations={localConversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
