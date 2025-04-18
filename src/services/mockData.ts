
import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';

export const mockAgents: User[] = [
  {
    id: 'agent1',
    name: 'João Silva',
    email: 'joao@prefeitura.gov.br',
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 3,
    secretaryId: 'sec1',
    secretaryName: 'Secretaria de Saúde',
    departmentId: 'dep1',
    departmentName: 'Atendimento',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  },
  {
    id: 'agent2',
    name: 'Maria Souza',
    email: 'maria@prefeitura.gov.br',
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 5,
    secretaryId: 'sec2',
    secretaryName: 'Secretaria de Educação',
    departmentId: 'dep2',
    departmentName: 'Matrículas',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  },
  {
    id: 'agent3',
    name: 'Roberto Lima',
    email: 'roberto@prefeitura.gov.br',
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: false,
    status: 'offline',
    maxConcurrentChats: 4,
    secretaryId: 'sec1',
    secretaryName: 'Secretaria de Saúde',
    departmentId: 'dep3',
    departmentName: 'Agendamentos',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  },
  {
    id: 'agent4', 
    name: 'Carlos Santos',
    email: 'carlos@prefeitura.gov.br',
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 4,
    secretaryId: '1c400845-366a-481f-a8b2-b9e43784c87b', // SEFAZ ID from console logs
    secretaryName: 'SEFAZ',
    departmentId: 'iptu-dep',
    departmentName: 'IPTU',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    userId: 'user1',
    userName: 'Atendimento #1',
    agentId: 'agent1',
    status: 'active',
    priority: 'medium',
    channel: 'web',
    transcript: '...',
    cpf: '12345678900',
    secretaryId: 'sec1',
    serviceId: 'serv1',
    isPublic: false,
    isBot: false,
    messages: [],
    timestamp: new Date(),
    lastMessageTime: new Date()
  },
  {
    id: 'conv2',
    userId: 'user2',
    userName: 'Atendimento #2',
    agentId: 'agent2',
    status: 'active',
    priority: 'high',
    channel: 'whatsapp',
    transcript: '...',
    cpf: '98765432100',
    secretaryId: 'sec2',
    serviceId: 'serv2',
    isPublic: false,
    isBot: false,
    messages: [],
    timestamp: new Date(),
    lastMessageTime: new Date()
  },
  {
    id: 'conv3',
    userId: 'user3',
    userName: 'Atendimento #3',
    agentId: 'agent3',
    status: 'closed',
    priority: 'low',
    channel: 'email',
    transcript: '...',
    cpf: '45678912300',
    secretaryId: 'sec1',
    serviceId: 'serv3',
    isPublic: false,
    isBot: false,
    messages: [],
    timestamp: new Date(),
    lastMessageTime: new Date()
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    content: 'Olá, preciso de ajuda com IPTU',
    conversationId: 'conv1',
    senderId: 'user1',
    senderName: 'Cliente',
    type: 'text',
    status: 'sent',
    fileUrl: null,
    timestamp: new Date()
  },
  {
    id: 'msg2',
    content: 'Claro, posso ajudar com isso',
    conversationId: 'conv1',
    senderId: 'agent1',
    senderName: 'Atendente',
    type: 'text',
    status: 'sent',
    fileUrl: null,
    timestamp: new Date()
  },
  {
    id: 'msg3',
    content: 'Qual o número do seu contribuinte?',
    conversationId: 'conv1',
    senderId: 'agent1',
    senderName: 'Atendente',
    type: 'text',
    status: 'sent',
    fileUrl: null,
    timestamp: new Date()
  }
];
