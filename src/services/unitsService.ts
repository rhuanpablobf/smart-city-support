
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';

export interface SecretaryWithDepartments {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  secretary_id: string;
  secretaryId?: string; // Add for compatibility
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  department_id: string;
  description: string | null;
  questionsAnswers: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: string;
  service_id: string;
  question: string;
  answer: string;
}

// Fetch all secretaries with their departments and services
export const fetchSecretariesWithDepartments = async (): Promise<SecretaryWithDepartments[]> => {
  try {
    // Fetch secretaries
    const { data: secretaries, error: secretariesError } = await supabase
      .from('secretaries')
      .select('*')
      .order('name');

    if (secretariesError) {
      console.error('Error fetching secretaries:', secretariesError);
      toast.error('Erro ao carregar secretarias');
      return [];
    }

    if (!secretaries || secretaries.length === 0) {
      return [];
    }

    // Fetch departments
    const { data: departments, error: departmentsError } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (departmentsError) {
      console.error('Error fetching departments:', departmentsError);
      toast.error('Erro ao carregar departamentos');
      return [];
    }

    // Fetch services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      toast.error('Erro ao carregar serviços');
      return [];
    }

    // Map the data to our hierarchical structure
    return secretaries.map(secretary => {
      const departmentsList = departments || [];
      const servicesList = services || [];
      
      const secretaryDepartments = departmentsList
        .filter(dept => dept.secretary_id === secretary.id)
        .map(dept => {
          const departmentServices = servicesList
            .filter(service => service.department_id === dept.id)
            .map(service => ({
              id: service.id,
              name: service.name,
              department_id: service.department_id,
              description: service.description,
              questionsAnswers: []
            }));

          return {
            id: dept.id,
            name: dept.name,
            secretary_id: dept.secretary_id,
            secretaryId: dept.secretary_id, // Add for compatibility
            services: departmentServices
          };
        });

      return {
        id: secretary.id,
        name: secretary.name,
        departments: secretaryDepartments
      };
    });
  } catch (error) {
    console.error('Error in fetchSecretariesWithDepartments:', error);
    toast.error('Erro ao carregar estrutura organizacional');
    return [];
  }
};

// Get secretaries
export const fetchSecretaries = async () => {
  try {
    const { data, error } = await supabase
      .from('secretaries')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching secretaries:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching secretaries:', error);
    toast.error('Erro ao carregar secretarias');
    return [];
  }
};

// Get departments by secretary ID
export const fetchDepartmentsBySecretary = async (secretaryId: string) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('secretary_id', secretaryId)
      .order('name');
    
    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
    
    // Add the secretaryId property for backward compatibility
    return (data || []).map((dept: any) => ({
      ...dept,
      secretaryId: dept.secretary_id
    }));
  } catch (error) {
    console.error('Error fetching departments:', error);
    toast.error('Erro ao carregar departamentos');
    return [];
  }
};

// Get services by department ID
export const fetchServicesByDepartment = async (departmentId: string) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('department_id', departmentId)
      .order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    toast.error('Erro ao carregar serviços');
    return [];
  }
};

// Add a new secretary
export const addSecretary = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('secretaries')
      .insert({ name })
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding secretary:', error);
    toast.error('Erro ao adicionar secretaria');
    return null;
  }
};

// Add a new department
export const addDepartment = async (name: string, secretaryId: string) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert({ 
        name, 
        secretary_id: secretaryId 
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Unidade adicionada com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding department:', error);
    toast.error('Erro ao adicionar unidade');
    return null;
  }
};

// Add a new service
export const addService = async (name: string, departmentId: string, description: string | null = null) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({ 
        name, 
        department_id: departmentId,
        description 
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    toast.success('Serviço adicionado com sucesso');
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error adding service:', error);
    toast.error('Erro ao adicionar serviço');
    return null;
  }
};
