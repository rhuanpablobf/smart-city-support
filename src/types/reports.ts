
export interface AgentPerformance {
  agentId: string;
  agentName: string;
  totalConversations: number;
  avgResponseTime: number;
  avgHandlingTime: number;
  satisfactionRate: number;
  transferRate: number;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalConversations: number;
  botResolutionRate: number;
  avgWaitTime: number;
  satisfactionRate: number;
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  departmentId: string;
  departmentName: string;
  totalConversations: number;
  botResolutionRate: number;
  avgHandlingTime: number;
  satisfactionRate: number;
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export interface ReportFilters {
  timeRange: TimeRange;
  departments?: string[];
  services?: string[];
  agents?: string[];
  resolutionType?: 'bot' | 'agent' | 'all';
}

export interface SatisfactionSurvey {
  conversationId: string;
  userId: string;
  agentId?: string;
  rating: number;
  comments?: string;
  botOnly: boolean;
  timestamp: Date;
}

export interface OverviewStats {
  attendanceData: {
    name: string;
    total: number;
    bot: number;
    human: number;
  }[];
  responseTimeData: {
    name: string;
    avg: number;
  }[];
  satisfactionData: {
    name: string;
    value: number;
  }[];
  resolutionData: {
    name: string;
    value: number;
  }[];
  kpiData: {
    total_attendances: number;
    total_growth: string;
    response_time: string;
    response_time_change: string;
    satisfaction: number;
    satisfaction_change: string;
  };
}
