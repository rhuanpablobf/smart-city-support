
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
      departmentName: stat.department_name || 'Unknown Department',
      totalConversations: stat.total_conversations || 0,
      botResolutionRate: stat.bot_resolution_rate || 0,
      avgWaitTime: stat.avg_wait_time || 0,
      satisfactionRate: stat.satisfaction_rate || 0
    }));
  } catch (error) {
    console.error('Error fetching department stats:', error);
    return []; // Return an empty array instead of throwing an error
  }
};

