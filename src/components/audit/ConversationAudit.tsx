
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Calendar, Clock, User, FileText } from 'lucide-react';
import { Conversation } from '@/types/chat';
import ChatBubble from '@/components/chat/ChatBubble';
import { Separator } from '@/components/ui/separator';
import { fetchConversations } from '@/services/conversationService';
import { format } from 'date-fns';

const CPF_REGEX = /^\d{11}$/;

const ConversationAudit: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSearch = async () => {
    if (!CPF_REGEX.test(cpf)) {
      toast.error('Por favor, digite um CPF válido (11 dígitos numéricos)');
      return;
    }
    
    setLoading(true);
    try {
      // This will need to be replaced with a proper API call to search by CPF
      const allConversations = await fetchConversations();
      const filteredConversations = allConversations.filter(
        conversation => conversation.userCpf === cpf
      );
      
      setConversations(filteredConversations);
      
      if (filteredConversations.length === 0) {
        toast.info('Nenhuma conversa encontrada para este CPF');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Erro ao buscar conversas');
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Auditoria de Conversas</h1>
      
      <div className="flex space-x-2 mb-6">
        <Input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
          placeholder="Digite o CPF para buscar"
          maxLength={11}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={loading || !CPF_REGEX.test(cpf)}>
          <Search className="mr-2 h-4 w-4" /> Buscar
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 border rounded-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="font-semibold mb-4">Conversas ({conversations.length})</h2>
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Digite um CPF e clique em buscar para ver as conversas
              </p>
            ) : (
              <div className="space-y-2">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Protocolo: {conversation.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        conversation.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : conversation.status === 'waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {conversation.status === 'active' 
                          ? 'Ativo'
                          : conversation.status === 'waiting'
                            ? 'Em espera'
                            : 'Encerrado'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(conversation.startedAt), 'dd/MM/yyyy')}
                      <Clock className="h-3 w-3 ml-3 mr-1" />
                      {format(new Date(conversation.startedAt), 'HH:mm')}
                    </div>
                    {conversation.department && (
                      <div className="text-xs text-gray-500 mt-1">
                        {conversation.department}
                        {conversation.service && ` > ${conversation.service}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="md:col-span-2 border rounded-lg p-4 h-[calc(100vh-200px)] overflow-y-auto">
            {selectedConversation ? (
              <>
                <div className="bg-white p-4 mb-4 rounded-lg border">
                  <h2 className="font-semibold text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Detalhes da Conversa
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Protocolo</p>
                      <p>{selectedConversation.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data/Hora</p>
                      <p>{format(new Date(selectedConversation.startedAt), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nome do Cliente</p>
                      <p>{selectedConversation.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CPF</p>
                      <p>{selectedConversation.userCpf || 'Não informado'}</p>
                    </div>
                    {selectedConversation.agentId && (
                      <div>
                        <p className="text-sm text-gray-500">Atendente</p>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{selectedConversation.agentId}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`px-2 py-1 rounded text-sm inline-block ${
                        selectedConversation.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : selectedConversation.status === 'waiting'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedConversation.status === 'active' 
                          ? 'Ativo'
                          : selectedConversation.status === 'waiting'
                            ? 'Em espera'
                            : 'Encerrado'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Histórico da Conversa</h3>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#ECE5DD' }}>
                    {selectedConversation.messages.map(message => (
                      <ChatBubble 
                        key={message.id} 
                        message={message} 
                        isCurrentUser={message.senderId === selectedConversation.userId} 
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="h-16 w-16 mb-4 opacity-30" />
                <p>Selecione uma conversa para ver os detalhes</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationAudit;
