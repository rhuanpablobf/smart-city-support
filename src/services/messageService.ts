
import { supabase } from "@/services/base/supabaseBase";
import { v4 as uuidv4 } from 'uuid';
import { User } from "@/types/auth";
import { Message, MessageType } from "@/types/chat";

// Create a new message
export const sendMessage = async (
  content: string, 
  conversationId: string, 
  currentUser: User | null,
  type: MessageType = 'text',
  fileUrl?: string,
  fileName?: string
): Promise<Message> => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const newMessage = {
    id: uuidv4(),
    conversation_id: conversationId,
    content,
    type,
    sender_id: currentUser.id,
    sender_name: currentUser.name,
    sender_role: currentUser.role,
    timestamp: new Date().toISOString(),
    status: 'sent',
    file_url: fileUrl,
    file_name: fileName
  };

  const { data, error } = await supabase
    .from('messages')
    .insert(newMessage)
    .select('*')
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  // Update the conversation's last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  // Format to match our type
  return {
    id: data.id,
    conversationId: data.conversation_id,
    content: data.content,
    type: data.type as MessageType,
    senderId: data.sender_id,
    senderName: data.sender_name,
    senderRole: data.sender_role,
    timestamp: new Date(data.timestamp),
    status: data.status as 'sent' | 'delivered' | 'read',
    fileUrl: data.file_url || undefined,
    fileName: data.file_name || undefined
  };
};

// Update message status
export const updateMessageStatus = async (messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', messageId);

  if (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

// Subscribe to new messages for a specific conversation
export const subscribeToMessages = (
  conversationId: string,
  onNewMessage: (message: Message) => void
) => {
  const channel = supabase
    .channel('messages-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        const newMsg = payload.new;
        onNewMessage({
          id: newMsg.id,
          conversationId: newMsg.conversation_id,
          content: newMsg.content,
          type: newMsg.type as MessageType,
          senderId: newMsg.sender_id,
          senderName: newMsg.sender_name,
          senderRole: newMsg.sender_role,
          timestamp: new Date(newMsg.timestamp),
          status: newMsg.status as 'sent' | 'delivered' | 'read',
          fileUrl: newMsg.file_url || undefined,
          fileName: newMsg.file_name || undefined
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
