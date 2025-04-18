
import { supabase } from "@/services/base/supabaseBase";
import { ServiceStats } from "@/types/reports";

// Fetch service statistics
export const fetchServiceStats = async (): Promise<ServiceStats[]> => {
  try {
    // Fetch service statistics from the database
    const { data, error } = await supabase
      .from('service_stats')
      .select('*');

    if (error) {
      console.error('Error fetching service stats:', error);
      throw error;
    }

    // Transform the data to match our ServiceStats type
    return data.map((stat: any) => ({
      serviceId: stat.service_id || null,
      serviceName: stat.service_name,
      departmentId: stat.department_id || null,
      departmentName: stat.department_name,
      totalConversations: stat.total_conversations,
      botResolutionRate: stat.bot_resolution_rate,
      avgHandlingTime: stat.avg_handling_time,
      satisfactionRate: stat.satisfaction_rate
    }));
  } catch (error) {
    console.error('Error fetching service stats:', error);
    throw error;
  }
};
