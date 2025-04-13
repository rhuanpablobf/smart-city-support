
import { supabase } from "@/services/base/supabaseBase";
import { OverviewStats } from "@/types/reports";

// Fetch overview statistics
export const fetchOverviewStats = async (): Promise<OverviewStats> => {
  try {
    // Fetch daily attendance data
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('daily_attendance')
      .select('*')
      .order('day_name');
    
    if (attendanceError) {
      console.error('Error fetching daily attendance:', attendanceError);
      throw attendanceError;
    }
    
    // Fetch response time data
    const { data: responseTimeData, error: responseTimeError } = await supabase
      .from('daily_response_time')
      .select('*')
      .order('day_name');
    
    if (responseTimeError) {
      console.error('Error fetching response time data:', responseTimeError);
      throw responseTimeError;
    }
    
    // Fetch satisfaction data
    const { data: satisfactionData, error: satisfactionError } = await supabase
      .from('satisfaction_distribution')
      .select('*')
      .order('rating');
    
    if (satisfactionError) {
      console.error('Error fetching satisfaction data:', satisfactionError);
      throw satisfactionError;
    }
    
    // Fetch resolution data
    const { data: resolutionData, error: resolutionError } = await supabase
      .from('resolution_distribution')
      .select('*');
    
    if (resolutionError) {
      console.error('Error fetching resolution data:', resolutionError);
      throw resolutionError;
    }
    
    // Fetch KPI data
    const { data: kpiData, error: kpiError } = await supabase
      .from('kpi_data')
      .select('*')
      .single();
    
    if (kpiError) {
      console.error('Error fetching KPI data:', kpiError);
      throw kpiError;
    }

    // Format and return the combined data
    return {
      attendanceData: attendanceData.map((item: any) => ({
        name: item.day_name,
        total: item.total,
        bot: item.bot,
        human: item.human
      })),
        
      responseTimeData: responseTimeData.map((item: any) => ({
        name: item.day_name,
        avg: item.avg_time
      })),
        
      satisfactionData: satisfactionData.map((item: any) => ({
        name: `${item.rating} estrelas`,
        value: item.count
      })),
        
      resolutionData: resolutionData.map((item: any) => ({
        name: item.resolution_type,
        value: item.percentage
      })),
        
      kpiData: {
        total_attendances: kpiData.total_attendances,
        total_growth: kpiData.total_growth,
        response_time: kpiData.response_time,
        response_time_change: kpiData.response_time_change,
        satisfaction: kpiData.satisfaction,
        satisfaction_change: kpiData.satisfaction_change
      }
    };
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    throw error;
  }
};
