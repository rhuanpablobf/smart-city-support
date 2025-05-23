
import { supabase } from "@/services/base/supabaseBase";
import { v4 as uuidv4 } from 'uuid';
import { User } from "@/types/auth";
import { Conversation, Message, MessageType } from "@/types/chat";

// Conversations
export const fetchConversations = async (): Promise<Conversation[]> => {
  const { data: conversationsData, error } = await supabase
    .from('conversations')
    .select(`
      id,
      user_id,
      user_cpf,
      user_name,
      agent_id,
      department_id,
      service_id,
      status,
      started_at,
      last_message_at,
      inactivity_warnings,
      is_bot
    `)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }

  // Fetch messages for each conversation
  const conversationsWithMessages: Conversation[] = [];

  for (const conv of conversationsData) {
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('timestamp', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      continue;
    }

    // Format data to match our types
    const conversation: Conversation = {
      id: conv.id,
      userId: conv.user_id,
      userCpf: conv.user_cpf || undefined,
      userName: conv.user_name,
      agentId: conv.agent_id || undefined,
      department: conv.department_id,
      service: conv.service_id,
      status: conv.status as 'active' | 'waiting' | 'closed',
      startedAt: new Date(conv.started_at),
      lastMessageAt: new Date(conv.last_message_at),
      messages: (messagesData || []).map(msg => ({
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
      inactivityWarnings: conv.inactivity_warnings,
      isBot: conv.is_bot
    };

    conversationsWithMessages.push(conversation);
  }

  return conversationsWithMessages;
};

// Create a new conversation
export const createConversation = async (
  userName: string,
  userCpf: string | undefined,
  departmentId: string | undefined,
  serviceId: string | undefined,
  currentUser: User | null,
  isBot: boolean = true
): Promise<Conversation> => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const newConversation = {
    user_id: uuidv4(), // In a real app, this would be the user's auth ID
    user_cpf: userCpf,
    user_name: userName,
    agent_id: isBot ? null : currentUser.id,
    department_id: departmentId,
    service_id: serviceId,
    status: isBot ? 'waiting' : 'active',
    started_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
    inactivity_warnings: 0,
    is_bot: isBot
  };

  const { data, error } = await supabase
    .from('conversations')
    .insert(newConversation)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  // Format to match our type
  return {
    id: data.id,
    userId: data.user_id,
    userCpf: data.user_cpf || undefined,
    userName: data.user_name,
    agentId: data.agent_id || undefined,
    department: data.department_id,
    service: data.service_id,
    status: data.status as 'active' | 'waiting' | 'closed',
    startedAt: new Date(data.started_at),
    lastMessageAt: new Date(data.last_message_at),
    messages: [],
    inactivityWarnings: data.inactivity_warnings,
    isBot: data.is_bot
  };
};

// Subscribe to conversation updates
export const subscribeToConversations = (
  onUpdate: (conversation: Partial<Conversation> & { id: string }) => void
) => {
  const channel = supabase
    .channel('conversations-channel')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations'
      },
      (payload) => {
        const updatedConv = payload.new;
        onUpdate({
          id: updatedConv.id,
          status: updatedConv.status as 'active' | 'waiting' | 'closed',
          lastMessageAt: new Date(updatedConv.last_message_at),
          agentId: updatedConv.agent_id || undefined,
          inactivityWarnings: updatedConv.inactivity_warnings
        });
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversations'
      },
      async (payload) => {
        const newConv = payload.new;
        
        // Fetch messages for this conversation
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', newConv.id);
          
        onUpdate({
          id: newConv.id,
          userId: newConv.user_id,
          userCpf: newConv.user_cpf || undefined,
          userName: newConv.user_name,
          agentId: newConv.agent_id || undefined,
          department: newConv.department_id,
          service: newConv.service_id,
          status: newConv.status as 'active' | 'waiting' | 'closed',
          startedAt: new Date(newConv.started_at),
          lastMessageAt: new Date(newConv.last_message_at),
          messages: (messagesData || []).map(msg => ({
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
          inactivityWarnings: newConv.inactivity_warnings,
          isBot: newConv.is_bot
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
