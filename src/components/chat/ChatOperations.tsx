
import React from 'react';
import ChatWindow from './ChatWindow';
import ConversationList from './ConversationList';
import QueueManagement from './QueueManagement';
import { Conversation } from '@/types/chat';
import { User } from '@/types/auth';

interface ChatOperationsProps {
  conversations: Conversation[];
  currentConversation?: Conversation;
  currentUser: User | null;
  loading: boolean;
  activeConversationsCount: number;
  onSelectConversation: (conversation: Conversation) => void;
  onStartNewConversation: () => Promise<void>;
  onSendMessage: (message: string, conversationId?: string) => void;
  onSendFile: (file: File, conversationId?: string) => void;
  onCloseConversation: (conversationId: string) => void;
  onTransferConversation: (conversationId: string, targetAgentId: string, targetDepartmentId?: string) => void;
}

const ChatOperations: React.FC<ChatOperationsProps> = ({
  conversations,
  currentConversation,
  currentUser,
  loading,
  activeConversationsCount,
  onSelectConversation,
  onStartNewConversation,
  onSendMessage,
  onSendFile,
  onCloseConversation,
  onTransferConversation
}) => {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'secretary_admin';
  const isAgent = currentUser?.role === 'agent' || currentUser?.role === 'manager';

  return (
    <div className="flex-1 flex overflow-hidden p-0">
      <div className="w-1/4 border-r">
        <ConversationList
          conversations={conversations}
          onSelectConversation={onSelectConversation}
          onStartNewConversation={isAdmin ? onStartNewConversation : undefined}
          selectedConversationId={currentConversation?.id}
          isLoading={loading}
        />
        {isAgent && (
          <div className="p-2 overflow-y-auto">
            <QueueManagement 
              onSelectConversation={(convId) => {
                const conversation = conversations.find(c => c.id === convId);
                if (conversation) onSelectConversation(conversation);
              }}
              activeConversations={activeConversationsCount}
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 h-full">
        <ChatWindow
          conversation={currentConversation}
          currentUser={currentUser}
          onSendMessage={onSendMessage}
          onSendFile={onSendFile}
          onCloseConversation={onCloseConversation}
          onTransferConversation={onTransferConversation}
          showBackButton={true}
          onBackClick={() => onSelectConversation(undefined)}
        />
      </div>
    </div>
  );
};

export default ChatOperations;
