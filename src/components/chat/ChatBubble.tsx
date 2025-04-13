
import React from 'react';
import { Message } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CheckCheck, Paperclip } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <div
      className={`flex mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`${
          isCurrentUser ? 'chat-bubble-sent' : 'chat-bubble-received'
        } ${message.type === 'system' ? 'bg-gray-100 text-gray-700 italic' : ''}`}
      >
        {message.type === 'file' && (
          <div className="flex items-center mb-1">
            <Paperclip className="h-4 w-4 mr-1" />
            <a 
              href={message.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 underline text-sm"
            >
              {message.fileName || 'Arquivo anexado'}
            </a>
          </div>
        )}
        
        <p>{message.content}</p>
        
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          {isCurrentUser && getStatusIcon()}
        </div>
        
        <span className="sr-only">{getTimeAgo(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
