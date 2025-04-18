
import React, { useState, useEffect } from 'react';
import { Conversation } from '@/types/chat';
import ChatWindow from '@/components/chat/ChatWindow';
import ConversationList from '@/components/chat/ConversationList';
import { useQuery } from '@tanstack/react-query';
import { fetchConversations } from '@/services';

const Dashboard = () => {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Fetch conversations using React Query
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations()
  });
  
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setConversations(data as Conversation[]);
    }
  }, [data]);
  
  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = (message: string, conversationId?: string) => {
    console.log("Sending message:", message, "to conversation:", conversationId || activeConversation?.id);
    // Here you would typically call an API to send the message
  };

  return (
    <div className="flex h-full">
      <div className="w-80 bg-white shadow-md border-r">
        <ConversationList
          conversations={conversations}
          selectedConversationId={activeConversation?.id}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoading}
        />
      </div>
      <div className="flex-1 p-4">
        {activeConversation ? (
          <ChatWindow 
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione uma conversa para visualizar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
