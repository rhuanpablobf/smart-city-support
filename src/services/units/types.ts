
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
