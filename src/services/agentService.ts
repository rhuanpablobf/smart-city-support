
import { supabase } from "@/services/base/supabaseBase";
import { AgentPerformance } from "@/types/reports";

// Agent performance statistics
export const fetchAgentPerformance = async (): Promise<AgentPerformance[]> => {
  try {
    // Fetch agent performance data from the database
    const { data, error } = await supabase
      .from('agent_performance')
      .select('*');

    if (error) {
      console.error('Error fetching agent performance:', error);
      throw error;
    }

    // Transform the data to match our AgentPerformance type
    return data.map((perf: any) => ({
      agentId: perf.agent_id,
      agentName: perf.agent_name,
      totalConversations: perf.total_conversations,
      avgResponseTime: perf.avg_response_time,
      avgHandlingTime: perf.avg_handling_time,
      satisfactionRate: perf.satisfaction_rate,
      transferRate: perf.transfer_rate
    }));
  } catch (error) {
    console.error('Error fetching agent performance:', error);
    throw error;
  }
};
