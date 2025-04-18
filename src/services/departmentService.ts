
import { supabase } from "@/services/base/supabaseBase";
import { DepartmentStats } from "@/types/reports";

// Fetch department statistics
export const fetchDepartmentStats = async (): Promise<DepartmentStats[]> => {
  try {
    // Fetch department statistics from the database
    const { data, error } = await supabase
      .from('department_stats')
      .select('*');

    if (error) {
      console.error('Error fetching department stats:', error);
      throw error;
    }

    // Transform the data to match our DepartmentStats type
    return data.map((stat: any) => ({
      departmentId: stat.department_id || null,
      departmentName: stat.department_name,
      totalConversations: stat.total_conversations,
      botResolutionRate: stat.bot_resolution_rate,
      avgWaitTime: stat.avg_wait_time,
      satisfactionRate: stat.satisfaction_rate
    }));
  } catch (error) {
    console.error('Error fetching department stats:', error);
    throw error;
  }
};
