
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/chat/ChatInterface';

const Chat: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-4 h-full flex flex-col">
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/contact')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
      
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
