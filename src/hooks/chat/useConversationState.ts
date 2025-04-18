
import { useState } from 'react';
import { Conversation } from '@/types/chat';

export function useConversationState() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>();
  const [loading, setLoading] = useState(true);

  const activeConversationsCount = conversations.filter(
    conv => conv.status === 'active'
  ).length;

  return {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    loading,
    setLoading,
    activeConversationsCount
  };
}
