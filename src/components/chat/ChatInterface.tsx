
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ChatWindow from '@/components/chat/ChatWindow';
import { Conversation, Message } from '@/types/chat';
import { createConversation, fetchConversations } from '@/services/conversationService';
import { sendMessage, subscribeToMessages } from '@/services/messageService';
import { fetchSecretariesWithDepartments } from '@/services/units/hierarchyService';
import { v4 as uuidv4 } from 'uuid';

const CPF_REGEX = /^\d{11}$/;

const ChatInterface: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'cpf' | 'secretary' | 'service' | 'chat'>('cpf');
  const [cpf, setCpf] = useState('');
  const [userName, setUserName] = useState('Cliente');
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>(undefined);
  const [hierarchyData, setHierarchyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [onlineAttendants, setOnlineAttendants] = useState<boolean>(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  
  useEffect(() => {
    const loadHierarchyData = async () => {
      try {
        setLoading(true);
        const data = await fetchSecretariesWithDepartments();
        setHierarchyData(data);
      } catch (error) {
        console.error('Error loading hierarchy data:', error);
        toast.error('Erro ao carregar dados organizacionais');
      } finally {
        setLoading(false);
      }
    };
    
    loadHierarchyData();
  }, []);

  const handleCPFSubmit = () => {
    if (!CPF_REGEX.test(cpf)) {
      toast.error('Por favor, digite um CPF válido (11 dígitos numéricos)');
      return;
    }
    
    // Generate protocol number using uuid
    const protocol = uuidv4().slice(0, 8).toUpperCase();
    toast.success(`Protocolo gerado: ${protocol}`);
    
    setStep('secretary');
  };

  const handleSecretarySelect = (secretaryId: string) => {
    setSelectedSecretaryId(secretaryId);
    setStep('service');
  };

  const handleServiceSelect = async (serviceId: string, serviceName: string) => {
    setSelectedServiceId(serviceId);
    setLoading(true);
    
    try {
      // Check if there's any online attendant for this service
      // This would be a real API call in production
      const hasOnlineAttendants = await checkOnlineAttendantsForService(serviceId);
      setOnlineAttendants(hasOnlineAttendants);
      
      // Create a new conversation
      const conversation = await createConversation(
        userName,
        cpf,
        selectedSecretaryId || undefined,
        serviceId,
        authState.user,
        true
      );
      
      setCurrentConversation(conversation);
      
      // Send system welcome message
      await sendMessage(
        `Bem-vindo ao atendimento! Você selecionou o serviço: ${serviceName}. Como posso ajudar?`,
        conversation.id,
        { id: 'system', name: 'Sistema', role: 'system' },
        'system'
      );
      
      // Load Q&A for this service and send as system message
      const secretary = hierarchyData.find(s => s.id === selectedSecretaryId);
      if (secretary) {
        const department = secretary.departments.find(d => 
          d.services.some(s => s.id === serviceId)
        );
        if (department) {
          const service = department.services.find(s => s.id === serviceId);
          if (service && service.questionsAnswers && service.questionsAnswers.length > 0) {
            const qaMessage = service.questionsAnswers.map(qa => 
              `Pergunta: ${qa.question}\nResposta: ${qa.answer}`
            ).join('\n\n');
            
            await sendMessage(
              `Aqui estão as perguntas frequentes sobre este serviço:\n\n${qaMessage}`,
              conversation.id,
              { id: 'system', name: 'Sistema', role: 'system' },
              'system'
            );
          }
        }
      }
      
      setStep('chat');
    } catch (error) {
      console.error('Error setting up conversation:', error);
      toast.error('Erro ao iniciar conversa');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string, conversationId?: string) => {
    if (!currentConversation) return;
    
    try {
      await sendMessage(
        messageContent, 
        currentConversation.id, 
        authState.user || { id: 'user', name: userName, role: 'user' }
      );
      
      // If message is requesting human attendant, check if available and update queue
      if (messageContent.toLowerCase().includes('atendente') || 
          messageContent.toLowerCase().includes('humano')) {
        if (onlineAttendants) {
          // Add to queue
          const position = await addToQueue(currentConversation.id);
          setQueuePosition(position);
          
          await sendMessage(
            `Você está na posição ${position} da fila. Em breve um atendente estará disponível.`,
            currentConversation.id,
            { id: 'system', name: 'Sistema', role: 'system' },
            'system'
          );
        } else {
          await sendMessage(
            "Nenhum atendente está online neste momento. Você pode continuar com as perguntas ou voltar mais tarde.",
            currentConversation.id,
            { id: 'system', name: 'Sistema', role: 'system' },
            'system'
          );
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  // Mock function to check for online attendants
  const checkOnlineAttendantsForService = async (serviceId: string): Promise<boolean> => {
    // In production, this would be a real API call to check attendant availability
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.5), 500);
    });
  };
  
  // Mock function to add user to queue
  const addToQueue = async (conversationId: string): Promise<number> => {
    // In production, this would be a real API call to add to queue
    return new Promise((resolve) => {
      const position = Math.floor(Math.random() * 5) + 1;
      setTimeout(() => resolve(position), 500);
    });
  };
  
  const handleSendFile = async (file: File) => {
    if (!currentConversation) return;
    
    try {
      toast.success('Arquivo enviado com sucesso!');
      // In production, this would upload the file and send a message with the file
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Erro ao enviar arquivo');
    }
  };
  
  const handleBackToQA = async () => {
    if (!currentConversation) return;
    
    try {
      await sendMessage(
        "Voltando para o sistema de perguntas e respostas. Como posso ajudar?",
        currentConversation.id,
        { id: 'system', name: 'Sistema', role: 'system' },
        'system'
      );
      
      // Reset queue position if was in queue
      setQueuePosition(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao processar solicitação');
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 'cpf':
        return (
          <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold">Bem-vindo ao Atendimento</h2>
            <p>Para iniciar, por favor informe seu CPF:</p>
            <Input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
              placeholder="Digite apenas números"
              maxLength={11}
              className="text-center text-lg"
            />
            <Button onClick={handleCPFSubmit} disabled={!CPF_REGEX.test(cpf)}>
              Continuar
            </Button>
          </div>
        );
      
      case 'secretary':
        return (
          <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold">Escolha a Secretaria</h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-2">
                {hierarchyData.map((secretary) => (
                  <Button 
                    key={secretary.id} 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => handleSecretarySelect(secretary.id)}
                  >
                    {secretary.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'service':
        const secretary = hierarchyData.find(s => s.id === selectedSecretaryId);
        const departments = secretary?.departments || [];
        
        return (
          <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold">Escolha o Serviço</h2>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="space-y-2">
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <div className="grid gap-2 ml-2">
                      {dept.services.map((service) => (
                        <Button 
                          key={service.id} 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => handleServiceSelect(service.id, service.name)}
                        >
                          {service.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" onClick={() => setStep('secretary')}>
              Voltar
            </Button>
          </div>
        );
      
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <ChatWindow
                conversation={currentConversation}
                currentUser={authState.user || { id: 'user', name: userName, role: 'user' }}
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
                loading={loading}
                showBackButton={false}
                chatControls={
                  <div className="flex space-x-2 mt-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleBackToQA}
                    >
                      🔙 Voltar para o sistema de perguntas
                    </Button>
                    
                    {onlineAttendants && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage("Gostaria de falar com um atendente, por favor.")}
                      >
                        🗣️ Falar com um atendente
                      </Button>
                    )}
                  </div>
                }
              />
              
              {queuePosition !== null && (
                <div className="bg-amber-50 p-2 rounded-md text-center text-sm border border-amber-200 mt-2">
                  Você está na posição {queuePosition} da fila de atendimento.
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {renderStepContent()}
    </div>
  );
};

export default ChatInterface;
