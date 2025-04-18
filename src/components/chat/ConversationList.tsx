
import React, { useState } from 'react';
import { Conversation } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Search, Plus, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '../reports/LoadingSpinner';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  onStartNewConversation?: () => void;
  isLoading?: boolean;
  className?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onStartNewConversation,
  isLoading = false,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getLastMessagePreview = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return '';
    
    if (lastMessage.type === 'file') {
      return '📎 Arquivo';
    }
    
    return lastMessage.content.length > 35
      ? lastMessage.content.substring(0, 35) + '...'
      : lastMessage.content;
  };
  
  const getLastMessageTime = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return '';
    
    return formatDistanceToNow(new Date(lastMessage.timestamp), {
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <div className={`h-full flex flex-col bg-white border-r ${className || ''}`}>
      <div className="p-3 border-b">
        <h2 className="font-medium text-lg mb-2">Conversas</h2>
        <div className="relative mb-2">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
          <Input
            placeholder="Pesquisar conversas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {onStartNewConversation && (
          <Button 
            onClick={onStartNewConversation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma conversa encontrada
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversationId === conversation.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{conversation.userName}</h3>
                    <span className="text-xs text-gray-500">
                      {getLastMessageTime(conversation)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {getLastMessagePreview(conversation)}
                  </p>
                  
                  <div className="flex mt-1">
                    {conversation.status === 'waiting' && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                        Aguardando
                      </Badge>
                    )}
                    
                    {conversation.isBot && (
                      <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 ml-1">
                        Bot
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
