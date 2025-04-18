
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation, Message, MessageType } from '@/types/chat';
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const { authState } = useAuth();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('conversation');
  
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  
  // Create a temporary user ID for non-authenticated users
  const [tempUserId] = useState(() => {
    const stored = localStorage.getItem('tempUserId');
    if (stored) return stored;
    const newId = Math.random().toString(36).substring(7);
    localStorage.setItem('tempUserId', newId);
    return newId;
  });
  
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;
      
      try {
        setLoading(true);
        
        // Fetch conversation
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();
        
        if (convError) {
          console.error('Error fetching conversation:', convError);
          return;
        }
        
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: true });
          
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          return;
        }
        
        // Format data with proper type casting
        const formattedConversation: Conversation = {
          id: convData.id,
          userId: convData.user_id,
          userName: convData.user_name,
          userCpf: convData.user_cpf || undefined,
          agentId: convData.agent_id || undefined,
          department: convData.department_id,
          service: convData.service_id,
          status: convData.status as 'active' | 'waiting' | 'closed',
          startedAt: new Date(convData.started_at),
          lastMessageAt: new Date(convData.last_message_at),
          messages: messagesData.map(msg => ({
            id: msg.id,
            conversationId: msg.conversation_id,
            content: msg.content,
            type: msg.type as MessageType,
            senderId: msg.sender_id,
            senderName: msg.sender_name,
            senderRole: msg.sender_role,
            timestamp: new Date(msg.timestamp),
            status: msg.status as 'sent' | 'delivered' | 'read',
            fileUrl: msg.file_url || undefined,
            fileName: msg.file_name || undefined
          })),
          inactivityWarnings: convData.inactivity_warnings,
          isBot: convData.is_bot
        };
        
        setConversation(formattedConversation);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar conversa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
    
    // Set up a subscription to listen for new messages
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage: Message = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            content: payload.new.content,
            type: payload.new.type as MessageType,
            senderId: payload.new.sender_id,
            senderName: payload.new.sender_name,
            senderRole: payload.new.sender_role,
            timestamp: new Date(payload.new.timestamp),
            status: payload.new.status as 'sent' | 'delivered' | 'read',
            fileUrl: payload.new.file_url || undefined,
            fileName: payload.new.file_name || undefined
          };
          
          setConversation(conv => {
            if (!conv) return null;
            return {
              ...conv,
              messages: [...conv.messages, newMessage]
            };
          });
        }
      )
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);
  
  const handleSendMessage = async (message: string) => {
    if (!conversation) return;
    
    try {
      const newMessage = {
        conversation_id: conversation.id,
        content: message,
        type: 'text',
        sender_id: tempUserId,
        sender_name: conversation.userName,
        sender_role: 'user',
        status: 'sent'
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);
        
      if (error) {
        console.error('Error sending message:', error);
        toast.error('Erro ao enviar mensagem');
        return;
      }
      
      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id);
        
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };
  
  // Redirect to chat start page if no conversation ID
  if (!conversationId) {
    window.location.href = '/chat';
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      {loading ? (
        <Card className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando atendimento...</span>
        </Card>
      ) : !conversation ? (
        <Card>
          <CardHeader>
            <CardTitle>Atendimento não encontrado</CardTitle>
            <CardDescription>
              O atendimento solicitado não foi encontrado ou já foi encerrado.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.location.href = '/chat'}>
              Iniciar novo atendimento
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex-1 flex flex-col h-full border rounded-lg overflow-hidden">
          <ChatWindow
            conversation={conversation}
            currentUser={authState.user || {
              id: tempUserId,
              name: conversation.userName,
              role: 'user'
            } as any}
            onSendMessage={handleSendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default Contact;
