
import { User } from './auth';

export type MessageType = 'text' | 'file' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: MessageType;
  senderId: string;
  senderName: string;
  senderRole: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userCpf?: string;
  userName: string;
  agentId?: string;
  department?: string;
  service?: string;
  status: 'active' | 'waiting' | 'closed';
  startedAt: Date;
  lastMessageAt: Date;
  messages: Message[];
  inactivityWarnings: number;
  isBot: boolean;
}

export interface Department {
  id: string;
  name: string;
  services: Service[];
}

export interface Service {
  id: string;
  departmentId: string;
  name: string;
  description?: string;
}

export interface BotFlow {
  id: string;
  departmentId?: string;
  serviceId?: string;
  nodes: BotFlowNode[];
  edges: BotFlowEdge[];
}

export interface BotFlowNode {
  id: string;
  type: 'question' | 'message' | 'input' | 'options';
  data: {
    text?: string;
    options?: {
      label: string;
      value: string;
      nextNodeId?: string;
    }[];
    inputType?: 'text' | 'cpf' | 'email' | 'number';
    validation?: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface BotFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface QueueItem {
  conversationId: string;
  userId: string;
  userName: string;
  departmentId?: string;
  serviceId?: string;
  waitingSince: Date;
  position: number;
  estimatedWaitTime?: number;
}
