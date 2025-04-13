
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from '@/components/chat/ChatWindow';
import { Conversation } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CustomerChat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch the conversation from Supabase
        // For now, simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock conversation data based on the conversation ID
        // In production, this would be a database call
        const mockConversation: Conversation = {
          id: conversationId || 'default-id',
          userId: 'user-123',
          userCpf: '123.456.789-00',
          userName: 'Maria Silva',
          agentId: authState.user?.id,
          department: 'dep1',
          service: 'ser1',
          status: 'active',
          startedAt: new Date(Date.now() - 3600000), // 1 hour ago
          lastMessageAt: new Date(),
          messages: [
            {
              id: 'msg1',
              conversationId: conversationId || 'default-id',
              content: 'Olá, gostaria de informações sobre o IPTU 2025.',
              type: 'text',
              senderId: 'user-123',
              senderName: 'Maria Silva',
              senderRole: 'user',
              timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
              status: 'read'
            },
            {
              id: 'msg2',
              conversationId: conversationId || 'default-id',
              content: 'Olá Maria, como posso te ajudar com o IPTU 2025?',
              type: 'text',
              senderId: authState.user?.id || 'agent-id',
              senderName: authState.user?.name || 'Atendente',
              senderRole: 'agent',
              timestamp: new Date(Date.now() - 1700000), // 28 minutes ago
              status: 'read'
            },
            {
              id: 'msg3',
              conversationId: conversationId || 'default-id',
              content: 'Gostaria de saber quando começa o pagamento com desconto.',
              type: 'text',
              senderId: 'user-123',
              senderName: 'Maria Silva',
              senderRole: 'user',
              timestamp: new Date(Date.now() - 900000), // 15 minutes ago
              status: 'read'
            }
          ],
          inactivityWarnings: 0,
          isBot: false
        };
        
        setConversation(mockConversation);
        setError(null);
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError('Erro ao carregar conversa. Tente novamente.');
        toast.error('Erro ao carregar conversa');
      } finally {
        setLoading(false);
      }
    };
    
    if (conversationId) {
      loadConversation();
    } else {
      setError('ID da conversa não encontrado');
      setLoading(false);
    }
  }, [conversationId, authState.user]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !conversation) return;
    
    const timestamp = new Date();
    const currentUser = authState.user;
    
    if (!currentUser) return;

    // Create new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      content,
      type: 'text' as const,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      timestamp,
      status: 'sent' as const
    };
    
    // Update conversation with new message
    setConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessageAt: timestamp
      };
    });
    
    // Simulate sending message to API
    // In a real app, we would save this to Supabase
    
    // Simulate message status changes
    setTimeout(() => {
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map(msg => {
            if (msg.id === newMessage.id) {
              return { ...msg, status: 'delivered' as const };
            }
            return msg;
          })
        };
      });
    }, 1000);
    
    setTimeout(() => {
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map(msg => {
            if (msg.id === newMessage.id) {
              return { ...msg, status: 'read' as const };
            }
            return msg;
          })
        };
      });
    }, 2000);
    
    // Simulate user response after 3 seconds
    setTimeout(() => {
      const responses = [
        "Ah, entendi! Obrigada pela informação.",
        "Você poderia me dar mais detalhes sobre isso, por favor?",
        "Onde posso conseguir mais informações?",
        "Preciso enviar algum documento para isso?",
        "E qual o valor do desconto para pagamento à vista?"
      ];
      
      const responseContent = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage = {
        id: `msg-${Date.now()}`,
        conversationId: conversation.id,
        content: responseContent,
        type: 'text' as const,
        senderId: 'user-123',
        senderName: 'Maria Silva',
        senderRole: 'user',
        timestamp: new Date(),
        status: 'read' as const
      };
      
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, responseMessage],
          lastMessageAt: new Date()
        };
      });
    }, 3000);
  };

  const handleSendFile = (file: File) => {
    if (!conversation) return;
    
    // Simulate file upload
    toast.success(`Arquivo "${file.name}" enviado`);
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      content: `Arquivo: ${file.name}`,
      type: 'file' as const,
      senderId: authState.user?.id || '',
      senderName: authState.user?.name || '',
      senderRole: authState.user?.role || 'agent',
      timestamp: new Date(),
      status: 'sent' as const,
      fileName: file.name,
      fileUrl: '#'
    };
    
    setConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessageAt: new Date()
      };
    });
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center flex-col gap-4">
        <p className="text-red-500">{error}</p>
        <button 
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleBackClick}
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ChatWindow
        conversation={conversation}
        currentUser={authState.user}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        onBackClick={handleBackClick}
        showBackButton={true}
      />
    </div>
  );
};

export default CustomerChat;
