
import { supabase } from '@/services/base/supabaseBase';
import { toast } from 'sonner';
import { SecretaryWithDepartments } from './types';

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
    
    // Fetch questions and answers for all services
    const { data: questionsAnswers, error: questionsError } = await supabase
      .from('questions_answers')
      .select('*')
      .order('id');

    if (questionsError) {
      console.error('Error fetching questions and answers:', questionsError);
      toast.error('Erro ao carregar perguntas e respostas');
    }

    // Map the data to our hierarchical structure
    return secretaries.map(secretary => {
      const departmentsList = departments || [];
      const servicesList = services || [];
      const qaList = questionsAnswers || [];
      
      const secretaryDepartments = departmentsList
        .filter(dept => dept.secretary_id === secretary.id)
        .map(dept => {
          const departmentServices = servicesList
            .filter(service => service.department_id === dept.id)
            .map(service => {
              // Find all questions/answers for this service
              const serviceQAs = qaList
                .filter(qa => qa.service_id === service.id)
                .map(qa => ({
                  id: qa.id,
                  service_id: qa.service_id,
                  question: qa.question,
                  answer: qa.answer
                }));

              return {
                id: service.id,
                name: service.name,
                department_id: service.department_id,
                description: service.description,
                questionsAnswers: serviceQAs
              };
            });

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
