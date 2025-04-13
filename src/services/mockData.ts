
import { Conversation, Message, Department, Service, BotFlow, QueueItem } from '@/types/chat';
import { AgentPerformance, DepartmentStats, ServiceStats, SatisfactionSurvey } from '@/types/reports';
import { User, UserRole } from '@/types/auth';

// Mock Departments and Services
export const mockDepartments: Department[] = [
  {
    id: 'dept1',
    name: 'Secretaria de Saúde',
    services: [
      {
        id: 'serv1',
        departmentId: 'dept1',
        name: 'Agendamento de Consultas',
        description: 'Agende consultas médicas na rede municipal de saúde'
      },
      {
        id: 'serv2',
        departmentId: 'dept1',
        name: 'Resultados de Exames',
        description: 'Consulte seus resultados de exames realizados na rede pública'
      }
    ]
  },
  {
    id: 'dept2',
    name: 'Secretaria de Educação',
    services: [
      {
        id: 'serv3',
        departmentId: 'dept2',
        name: 'Matrícula Escolar',
        description: 'Realize matrículas na rede municipal de educação'
      },
      {
        id: 'serv4',
        departmentId: 'dept2',
        name: 'Transporte Escolar',
        description: 'Solicite transporte escolar para estudantes'
      }
    ]
  },
  {
    id: 'dept3',
    name: 'Secretaria de Finanças',
    services: [
      {
        id: 'serv5',
        departmentId: 'dept3',
        name: 'IPTU',
        description: 'Consultas e pagamentos de IPTU'
      },
      {
        id: 'serv6',
        departmentId: 'dept3',
        name: 'Certidão Negativa',
        description: 'Obtenha certidão negativa de débitos municipais'
      }
    ]
  }
];

// Mock Bot Flow for CPF + Department selection
export const initialBotFlow: BotFlow = {
  id: 'initialFlow',
  nodes: [
    {
      id: 'welcome',
      type: 'message',
      data: {
        text: 'Olá! Bem-vindo ao atendimento da prefeitura. Como posso ajudar?'
      },
      position: { x: 0, y: 0 }
    },
    {
      id: 'cpf',
      type: 'input',
      data: {
        text: 'Por favor, informe seu CPF para iniciarmos o atendimento:',
        inputType: 'cpf',
        validation: '^[0-9]{11}$'
      },
      position: { x: 0, y: 100 }
    },
    {
      id: 'department',
      type: 'options',
      data: {
        text: 'Qual secretaria você deseja contatar?',
        options: mockDepartments.map(dept => ({
          label: dept.name,
          value: dept.id
        }))
      },
      position: { x: 0, y: 200 }
    }
  ],
  edges: [
    { id: 'e1', source: 'welcome', target: 'cpf' },
    { id: 'e2', source: 'cpf', target: 'department' }
  ]
};

// Mock Users
export const mockAgents: User[] = [
  {
    id: 'agent1',
    name: 'Carlos Silva',
    email: 'carlos@example.com',
    role: 'agent' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 3
  },
  {
    id: 'agent2',
    name: 'Ana Paula',
    email: 'ana@example.com',
    role: 'agent' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 5
  },
  {
    id: 'agent3',
    name: 'Roberto Gomes',
    email: 'roberto@example.com',
    role: 'agent' as UserRole,
    avatar: '/placeholder.svg',
    isOnline: false,
    status: 'offline',
    maxConcurrentChats: 4
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    userId: 'user1',
    userCpf: '12345678901',
    userName: 'Maria Santos',
    agentId: 'agent1',
    department: 'dept1',
    service: 'serv1',
    status: 'active',
    startedAt: new Date(Date.now() - 3600000), // 1 hour ago
    lastMessageAt: new Date(Date.now() - 60000), // 1 minute ago
    messages: [
      {
        id: 'msg1',
        conversationId: 'conv1',
        content: 'Olá, preciso agendar uma consulta',
        type: 'text',
        senderId: 'user1',
        senderName: 'Maria Santos',
        senderRole: 'user',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
      },
      {
        id: 'msg2',
        conversationId: 'conv1',
        content: 'Olá Maria, como posso ajudar com o agendamento?',
        type: 'text',
        senderId: 'agent1',
        senderName: 'Carlos Silva',
        senderRole: 'agent',
        timestamp: new Date(Date.now() - 3500000),
        status: 'read'
      }
    ],
    inactivityWarnings: 0,
    isBot: false
  },
  {
    id: 'conv2',
    userId: 'user2',
    userCpf: '98765432101',
    userName: 'João Pereira',
    department: 'dept2',
    service: 'serv3',
    status: 'waiting',
    startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
    lastMessageAt: new Date(Date.now() - 300000), // 5 minutes ago
    messages: [
      {
        id: 'msg3',
        conversationId: 'conv2',
        content: 'Preciso fazer matrícula para meu filho',
        type: 'text',
        senderId: 'user2',
        senderName: 'João Pereira',
        senderRole: 'user',
        timestamp: new Date(Date.now() - 1800000),
        status: 'read'
      },
      {
        id: 'msg4',
        conversationId: 'conv2',
        content: 'Por favor informe a idade dele e a escola desejada',
        type: 'text',
        senderId: 'system',
        senderName: 'Assistente Virtual',
        senderRole: 'system',
        timestamp: new Date(Date.now() - 1750000),
        status: 'read'
      }
    ],
    inactivityWarnings: 1,
    isBot: true
  }
];

// Mock Queue
export const mockQueue: QueueItem[] = [
  {
    conversationId: 'conv2',
    userId: 'user2',
    userName: 'João Pereira',
    departmentId: 'dept2',
    serviceId: 'serv3',
    waitingSince: new Date(Date.now() - 300000), // 5 minutes ago
    position: 1,
    estimatedWaitTime: 180 // 3 minutes
  },
  {
    conversationId: 'conv3',
    userId: 'user3',
    userName: 'Fernanda Lima',
    departmentId: 'dept3',
    serviceId: 'serv5',
    waitingSince: new Date(Date.now() - 240000), // 4 minutes ago
    position: 2,
    estimatedWaitTime: 360 // 6 minutes
  }
];

// Mock Reports Data
export const mockAgentPerformance: AgentPerformance[] = [
  {
    agentId: 'agent1',
    agentName: 'Carlos Silva',
    totalConversations: 42,
    avgResponseTime: 45, // seconds
    avgHandlingTime: 480, // seconds
    satisfactionRate: 4.7, // out of 5
    transferRate: 0.05 // 5%
  },
  {
    agentId: 'agent2',
    agentName: 'Ana Paula',
    totalConversations: 38,
    avgResponseTime: 32, // seconds
    avgHandlingTime: 520, // seconds
    satisfactionRate: 4.8, // out of 5
    transferRate: 0.08 // 8%
  }
];

export const mockDepartmentStats: DepartmentStats[] = [
  {
    departmentId: 'dept1',
    departmentName: 'Secretaria de Saúde',
    totalConversations: 156,
    botResolutionRate: 0.65, // 65%
    avgWaitTime: 210, // seconds
    satisfactionRate: 4.3 // out of 5
  },
  {
    departmentId: 'dept2',
    departmentName: 'Secretaria de Educação',
    totalConversations: 98,
    botResolutionRate: 0.48, // 48%
    avgWaitTime: 180, // seconds
    satisfactionRate: 4.5 // out of 5
  },
  {
    departmentId: 'dept3',
    departmentName: 'Secretaria de Finanças',
    totalConversations: 124,
    botResolutionRate: 0.72, // 72%
    avgWaitTime: 150, // seconds
    satisfactionRate: 4.2 // out of 5
  }
];

export const mockServiceStats: ServiceStats[] = [
  {
    serviceId: 'serv1',
    serviceName: 'Agendamento de Consultas',
    departmentId: 'dept1',
    departmentName: 'Secretaria de Saúde',
    totalConversations: 92,
    botResolutionRate: 0.45, // 45%
    avgHandlingTime: 420, // seconds
    satisfactionRate: 4.4 // out of 5
  },
  {
    serviceId: 'serv5',
    serviceName: 'IPTU',
    departmentId: 'dept3',
    departmentName: 'Secretaria de Finanças',
    totalConversations: 78,
    botResolutionRate: 0.82, // 82%
    avgHandlingTime: 240, // seconds
    satisfactionRate: 4.6 // out of 5
  }
];

export const mockSatisfactionSurveys: SatisfactionSurvey[] = [
  {
    conversationId: 'conv1',
    userId: 'user1',
    agentId: 'agent1',
    rating: 5,
    comments: 'Excelente atendimento! Muito útil.',
    botOnly: false,
    timestamp: new Date(Date.now() - 3000000) // 50 minutes ago
  },
  {
    conversationId: 'conv4',
    userId: 'user4',
    rating: 4,
    comments: 'O bot resolveu meu problema rápido',
    botOnly: true,
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  }
];
