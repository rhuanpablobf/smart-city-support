
import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Conversation, Message } from '@/types/chat';
import { User } from '@/types/auth';
import { AlertCircle } from 'lucide-react';

interface ChatWindowProps {
  conversation?: Conversation;
  currentUser?: User | null;
  onSendMessage: (message: string, conversationId?: string) => void;
  onSendFile?: (file: File, conversationId?: string) => void;
  onBackClick?: () => void;
  loading?: boolean;
  showBackButton?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUser,
  onSendMessage,
  onSendFile,
  onBackClick,
  loading = false,
  showBackButton = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (message: string) => {
    onSendMessage(message, conversation?.id);
  };

  const handleSendFile = (file: File) => {
    if (onSendFile) {
      onSendFile(file, conversation?.id);
    }
  };

  const isCurrentUser = (message: Message) => {
    return currentUser ? message.senderId === currentUser.id : false;
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        conversation={conversation}
        onBackClick={onBackClick}
        showBackButton={showBackButton}
      />
      
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{ backgroundColor: '#ECE5DD' }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !conversation ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
            <p className="text-lg">Selecione uma conversa ou inicie uma nova</p>
          </div>
        ) : (
          <>
            {conversation.status === 'waiting' && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                <AlertDescription>
                  Este chat está na fila de espera. Posição estimada: {conversation.messages.length % 3 + 1}.
                </AlertDescription>
              </Alert>
            )}
            
            {conversation.messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser(message)}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        disabled={loading || !conversation || conversation.status === 'closed'}
        placeholder={!conversation ? 'Selecione um chat para enviar mensagens...' : 'Digite sua mensagem...'}
      />
    </div>
  );
};

export default ChatWindow;
