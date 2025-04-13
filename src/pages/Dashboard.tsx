
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatWindow from '@/components/chat/ChatWindow';
import ConversationList from '@/components/chat/ConversationList';
import { Conversation, Message } from '@/types/chat';
import { mockConversations } from '@/services/mockData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading conversations from API
    const loadConversations = async () => {
      try {
        setLoading(true);
        // Wait for simulated API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we'd fetch conversations for the current user
        setConversations(mockConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Erro ao carregar conversas');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    // Navigate to dedicated chat page
    navigate(`/chat/${conversation.id}`);
  };

  const handleSendMessage = (content: string, conversationId?: string) => {
    if (!content.trim() || !conversationId) return;
    
    const timestamp = new Date();
    const currentUser = authState.user;
    
    if (!currentUser) return;

    // Create new message
    const newMessage: Message = {
      id: uuidv4(),
      conversationId,
      content,
      type: 'text',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      timestamp,
      status: 'sent'
    };
    
    // Update conversations with new message
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageAt: timestamp
          };
        }
        return conv;
      });
    });
    
    // Also update selected conversation if it's the current one
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessageAt: timestamp
        };
      });
    }
    
    // Simulate message status updates (delivered -> read)
    setTimeout(() => {
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: conv.messages.map(msg => {
                if (msg.id === newMessage.id) {
                  return { ...msg, status: 'delivered' };
                }
                return msg;
              })
            };
          }
          return conv;
        });
      });
      
      // Also update selected conversation
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map(msg => {
              if (msg.id === newMessage.id) {
                return { ...msg, status: 'delivered' };
              }
              return msg;
            })
          };
        });
      }
    }, 1000);
    
    setTimeout(() => {
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: conv.messages.map(msg => {
                if (msg.id === newMessage.id) {
                  return { ...msg, status: 'read' };
                }
                return msg;
              })
            };
          }
          return conv;
        });
      });
      
      // Also update selected conversation
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map(msg => {
              if (msg.id === newMessage.id) {
                return { ...msg, status: 'read' };
              }
              return msg;
            })
          };
        });
      }
    }, 2000);
    
    // Simulate bot or customer response in 1-3 seconds
    if (Math.random() > 0.3) {
      const responseDelay = Math.floor(Math.random() * 2000) + 1000;
      setTimeout(() => {
        const responses = [
          "Entendi, obrigado pela informação.",
          "Poderia me dar mais detalhes sobre isso, por favor?",
          "Estou verificando isso para você.",
          "Vou encaminhar sua solicitação ao setor responsável.",
          "Isso deve ser resolvido em breve."
        ];
        
        const responseContent = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: uuidv4(),
          conversationId,
          content: responseContent,
          type: 'text',
          senderId: `user${Math.floor(Math.random() * 5) + 1}`,
          senderName: selectedConversation?.userName || 'Cliente',
          senderRole: 'user',
          timestamp: new Date(),
          status: 'read'
        };
        
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: [...conv.messages, responseMessage],
                lastMessageAt: new Date()
              };
            }
            return conv;
          });
        });
        
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, responseMessage],
              lastMessageAt: new Date()
            };
          });
        }
      }, responseDelay);
    }
  };

  const handleSendFile = (file: File, conversationId?: string) => {
    if (!conversationId) return;
    
    const timestamp = new Date();
    const currentUser = authState.user;
    
    if (!currentUser) return;

    // In a real app, we'd upload the file to a storage service
    // and then send a message with the file URL
    toast.success(`Arquivo "${file.name}" enviado`);
    
    // Create new file message
    const newMessage: Message = {
      id: uuidv4(),
      conversationId,
      content: `Arquivo: ${file.name}`,
      type: 'file',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      timestamp,
      status: 'sent',
      fileName: file.name,
      fileUrl: '#'
    };
    
    // Update conversations with new message
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageAt: timestamp
          };
        }
        return conv;
      });
    });
    
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessageAt: timestamp
        };
      });
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
            conversations={conversations}
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
            loading={loading}
            showBackButton={true}
          />
        </div>
        
        <div className={`flex-1 md:hidden ${selectedConversation ? 'hidden' : 'block'}`}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
