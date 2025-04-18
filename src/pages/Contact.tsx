
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center">Atendimento ao Cidadão</h1>
      <p className="text-gray-500 mb-12 text-center max-w-2xl">
        Fale conosco e tire suas dúvidas sobre serviços e informações da prefeitura
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Chat Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5" />
              Chat Online
            </CardTitle>
            <CardDescription>Atendimento imediato com nossos atendentes</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Converse em tempo real com nossa equipe de atendimento. Disponível nos dias úteis das 8h às 18h.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/chat')}
            >
              Iniciar Chat <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* More service cards can be added here */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/5">
            <CardTitle>SEFAZ</CardTitle>
            <CardDescription>Secretaria da Fazenda</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Serviços relacionados a tributos, IPTU, impostos e notas fiscais do município.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => navigate('/chat')}
            >
              Acessar Serviços <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/5">
            <CardTitle>Ouvidoria</CardTitle>
            <CardDescription>Reclamações e Sugestões</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>Registre reclamações, elogios, denúncias ou sugestões para a administração municipal.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => navigate('/chat')}
            >
              Fazer Solicitação <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 text-center max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Outros Canais de Atendimento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Telefone</h3>
            <p>(XX) XXXX-XXXX</p>
            <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 18h</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Email</h3>
            <p>atendimento@prefeitura.gov.br</p>
            <p className="text-sm text-gray-500">Resposta em até 2 dias úteis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
