import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from '@/components/chat/ChatWindow';
import ConversationList from '@/components/chat/ConversationList';
import { Conversation } from '@/types/chat';
import { fetchConversations, createConversation, subscribeToConversations } from '@/services/conversationService';
import { sendMessage, subscribeToMessages } from '@/services/messageService';
import ChatInterface from '@/components/chat/ChatInterface';
import QueueManagement from '@/components/chat/QueueManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationAudit from '@/components/audit/ConversationAudit';
import { UserRole } from '@/types/auth';

const Dashboard = () => {
  const { authState } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>();
  const [loading, setLoading] = useState(true);

  // Role-based UI control
  const isAdmin = authState.user?.role === 'admin' || authState.user?.role === 'secretary_admin';
  const isAgent = authState.user?.role === 'agent' || authState.user?.role === 'manager';
  const isUser = authState.user?.role === 'user' || !authState.user;
  
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

        // If we were viewing a conversation, update it
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

    // Subscribe to conversation updates
    const unsubscribe = subscribeToConversations((updatedConversation) => {
      setConversations(prev => {
        // Check if the conversation is new
        const existing = prev.find(c => c.id === updatedConversation.id);
        
        if (!existing) {
          return [...prev, updatedConversation as Conversation];
        }
        
        // Update existing conversation
        return prev.map(c => 
          c.id === updatedConversation.id ? { ...c, ...updatedConversation } : c
        );
      });
      
      // If we're viewing this conversation, update it
      if (currentConversation?.id === updatedConversation.id) {
        setCurrentConversation(prev => ({ ...prev!, ...updatedConversation }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authState.isAuthenticated, currentConversation?.id]);

  // Subscribe to messages for the current conversation
  useEffect(() => {
    if (!currentConversation) return;

    const unsubscribe = subscribeToMessages(currentConversation.id, (newMessage) => {
      setCurrentConversation(prev => {
        if (!prev) return prev;
        
        // Add new message if it doesn't exist
        const messageExists = prev.messages.some(m => m.id === newMessage.id);
        if (!messageExists) {
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessageAt: new Date()
          };
        }
        
        return prev;
      });
      
      // Also update in the conversations list
      setConversations(prev => prev.map(c => {
        if (c.id === currentConversation.id) {
          const messageExists = c.messages.some(m => m.id === newMessage.id);
          if (!messageExists) {
            return {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessageAt: new Date()
            };
          }
        }
        return c;
      }));
    });

    return () => {
      unsubscribe();
    };
  }, [currentConversation]);

  const handleSendMessage = async (messageContent: string, conversationId?: string) => {
    if (!conversationId && !currentConversation) {
      // No conversation selected, show error or create a new one
      return;
    }
    
    const targetConvId = conversationId || currentConversation!.id;
    
    try {
      if (!authState.user) {
        throw new Error('User not authenticated');
      }
      
      await sendMessage(messageContent, targetConvId, authState.user);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendFile = async (file: File, conversationId?: string) => {
    // In a real app, this would upload the file to storage and then send a message with the file link
    console.log('Send file:', file, 'to conversation:', conversationId || currentConversation?.id);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleStartConversation = async () => {
    try {
      if (!authState.user) {
        throw new Error('User not authenticated');
      }
      
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
      
      // Send welcome message
      await sendMessage(
        'Olá! Como posso ajudar?', 
        newConversation.id, 
        authState.user
      );
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const renderDashboardContent = () => {
    if (isUser) {
      // Customer interface
      return <ChatInterface />;
    }
    
    if (isAgent || isAdmin) {
      // Agent or admin interface with tabs
      return (
        <Tabs defaultValue="conversations" className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="conversations">Conversas</TabsTrigger>
              {isAdmin && <TabsTrigger value="audit">Auditoria</TabsTrigger>}
            </TabsList>
          </div>
          
          <TabsContent value="conversations" className="flex-1 flex overflow-hidden p-0">
            <div className="w-1/4 border-r">
              <ConversationList
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                onStartConversation={handleStartConversation}
                selectedConversationId={currentConversation?.id}
                loading={loading}
                className="h-4/5 border-b"
              />
              {isAgent && (
                <div className="p-2 overflow-y-auto h-1/5">
                  <QueueManagement 
                    onSelectConversation={(convId) => {
                      const conversation = conversations.find(c => c.id === convId);
                      if (conversation) handleSelectConversation(conversation);
                    }}
                    activeConversations={activeConversationsCount}
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 h-full">
              <ChatWindow
                conversation={currentConversation}
                currentUser={authState.user}
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
                showBackButton={true}
                onBackClick={() => setCurrentConversation(undefined)}
              />
            </div>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="audit" className="flex-1 overflow-auto p-0">
              <ConversationAudit />
            </TabsContent>
          )}
        </Tabs>
      );
    }
    
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Acesso não autorizado</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto h-full">
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;
