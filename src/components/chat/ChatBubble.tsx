
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Message, MessageType } from '@/types/chat';
import { FileText, CheckCheck, Check } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isCurrentUser }) => {
  const formatTime = (timestamp: Date) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time', error);
      return '';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'read') {
      return <CheckCheck size={16} className="text-primary" />;
    } else if (status === 'delivered') {
      return <CheckCheck size={16} className="text-gray-400" />;
    } else {
      return <Check size={16} className="text-gray-400" />;
    }
  };

  const renderMessageContent = () => {
    if (message.type === 'file') {
      return (
        <div className="flex items-center">
          <FileText className="mr-2" size={16} />
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {message.fileName || 'Arquivo'}
          </a>
        </div>
      );
    } else if (message.type === 'system' as MessageType) {
      return <em className="text-gray-500">{message.content}</em>;
    } else {
      return message.content;
    }
  };

  return (
    <div
      className={`flex mb-4 ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
          isCurrentUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-white rounded-bl-none'
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-semibold mb-1 text-gray-500">
            {message.senderName}
          </p>
        )}
        <div className="message-body">{renderMessageContent()}</div>
        <div
          className={`text-xs mt-1 flex justify-end items-center ${
            isCurrentUser ? 'text-white/80' : 'text-gray-400'
          }`}
        >
          {formatTime(message.timestamp)}
          {isCurrentUser && (
            <span className="ml-1">{getStatusIcon(message.status)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
