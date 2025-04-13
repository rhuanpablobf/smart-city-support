
// This file is kept for reference but no longer used
// Data is now fetched directly from Supabase

import { BotFlow } from '@/types/chat';
import { AgentPerformance, DepartmentStats, ServiceStats, SatisfactionSurvey } from '@/types/reports';
import { User, UserRole } from '@/types/auth';

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
        options: [] // This will be filled from Supabase data
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
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 3
  },
  {
    id: 'agent2',
    name: 'Ana Paula',
    email: 'ana@example.com',
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: true,
    status: 'online',
    maxConcurrentChats: 5
  },
  {
    id: 'agent3',
    name: 'Roberto Gomes',
    email: 'roberto@example.com',
    role: 'agent',
    avatar: '/placeholder.svg',
    isOnline: false,
    status: 'offline',
    maxConcurrentChats: 4
  }
];

// Mock Reports Data - These would also be fetched from Supabase in a real app
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

// Define mock department stats for use in reports
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
