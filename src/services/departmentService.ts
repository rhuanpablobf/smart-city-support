
import { supabase } from "@/services/base/supabaseBase";
import { Department } from "@/types/chat";
import { DepartmentStats } from "@/types/reports";

// Departments
export const fetchDepartments = async (): Promise<Department[]> => {
  const { data, error } = await supabase
    .from('departments')
    .select(`
      id,
      name,
      services (
        id,
        department_id,
        name,
        description
      )
    `);

  if (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }

  // Transform the data to match our Department and Service types
  const departments: Department[] = data.map((dept: any) => ({
    id: dept.id,
    name: dept.name,
    services: dept.services.map((serv: any) => ({
      id: serv.id,
      departmentId: serv.department_id,
      name: serv.name,
      description: serv.description
    }))
  }));

  return departments;
};

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
      departmentId: stat.department_id,
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
