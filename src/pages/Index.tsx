
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainNav from '@/components/layout/MainNav';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">ChatPrefeitura</span>
        </div>
        <MainNav />
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Atendimento Digital da Prefeitura</h1>
            <p className="text-lg mb-8 text-gray-600">
              Conectando cidadãos aos serviços municipais de forma fácil e rápida.
              Tire dúvidas, solicite informações e acesse serviços sem sair de casa.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => navigate('/contact')}>
                Iniciar Atendimento
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Área do Servidor
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-xl">
              <div className="mb-4 bg-primary/10 rounded-md p-4">
                <div className="flex items-start mb-3">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white mr-2">A</div>
                  <div className="bg-gray-100 rounded-lg p-3 ml-1 max-w-[80%]">
                    <p className="text-sm">Como posso ajudar hoje?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-white rounded-lg p-3 mr-2 max-w-[80%]">
                    <p className="text-sm">Preciso de informações sobre IPTU</p>
                  </div>
                </div>
                <div className="flex items-start mt-3">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white mr-2">A</div>
                  <div className="bg-gray-100 rounded-lg p-3 ml-1 max-w-[80%]">
                    <p className="text-sm">Claro! Você pode consultar o seu IPTU online através do site da prefeitura ou posso direcionar você ao setor responsável.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => navigate('/contact')}
                >
                  Iniciar Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 ChatPrefeitura. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Termos de Uso</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Política de Privacidade</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Acessibilidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
