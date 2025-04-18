
import { User } from "./auth";

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

export interface ChatOperationsProps {
  conversations: Conversation[];
  currentConversation: Conversation | undefined;
  currentUser: User | null;
  loading: boolean;
  activeConversationsCount: number;
  onSelectConversation: (conversation: Conversation) => void;
  onStartNewConversation: () => Promise<void>;
  onSendMessage: (content: string, conversationId?: string) => Promise<void>;
  onSendFile: (file: File, conversationId?: string) => Promise<void>;
  onCloseConversation: (conversationId: string) => Promise<void>;
  onTransferConversation: (conversationId: string, targetAgentId: string, targetDepartmentId?: string) => Promise<void>;
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
