
import React, { useState, useEffect } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/services/base/supabaseBase';

const Chat: React.FC = () => {
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userCpf, setUserCpf] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch departments when component mounts
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('secretaries')
          .select(`
            id,
            name,
            departments (
              id,
              name,
              services (
                id,
                name,
                description
              )
            )
          `)
          .order('name');
          
        if (error) {
          console.error('Error fetching departments:', error);
        } else if (data) {
          setDepartmentsData(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);

  // This is where you would handle starting a new conversation with the selected department and service
  const handleStartConversation = async () => {
    if (!userName.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }
    
    // Here you would create a conversation in the database using supabase
    try {
      // In a real app, you would use the API to create a conversation and redirect to the chat interface
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: Math.random().toString(36).substring(7), // generate a random ID for non-authenticated users
          user_name: userName,
          user_cpf: userCpf || null,
          department_id: selectedDepartment,
          service_id: selectedService,
          status: 'waiting',
          is_bot: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating conversation:', error);
        alert('Erro ao iniciar conversa. Por favor, tente novamente.');
        return;
      }
      
      // Redirect to the chat interface with the conversation ID
      window.location.href = `/contact?conversation=${data.id}`;
      
    } catch (err) {
      console.error('Error:', err);
      alert('Erro ao iniciar conversa. Por favor, tente novamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Atendimento Online</CardTitle>
          <CardDescription>
            Selecione o departamento e serviço para iniciar um atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Nome</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Seu nome completo"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">CPF (opcional)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="000.000.000-00"
                  value={userCpf}
                  onChange={(e) => setUserCpf(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Secretaria</label>
                <select
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => {
                    setSelectedDepartment(null);
                    setSelectedService(null);
                  }}
                >
                  <option value="">Selecione uma secretaria</option>
                  {departmentsData.map((secretary: any) => (
                    <option key={secretary.id} value={secretary.id}>
                      {secretary.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Departamento</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedDepartment || ""}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value || null);
                    setSelectedService(null);
                  }}
                  disabled={!departmentsData.some((sec: any) => sec.departments?.length > 0)}
                >
                  <option value="">Selecione um departamento</option>
                  {departmentsData.flatMap((secretary: any) => 
                    secretary.departments?.map((department: any) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    )) || []
                  )}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Serviço</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedService || ""}
                  onChange={(e) => setSelectedService(e.target.value || null)}
                  disabled={!selectedDepartment}
                >
                  <option value="">Selecione um serviço</option>
                  {departmentsData
                    .flatMap((secretary: any) => secretary.departments || [])
                    .filter((department: any) => department.id === selectedDepartment)
                    .flatMap((department: any) => 
                      department.services?.map((service: any) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      )) || []
                    )}
                </select>
              </div>
              
              <button
                className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90"
                onClick={handleStartConversation}
              >
                Iniciar Atendimento
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
