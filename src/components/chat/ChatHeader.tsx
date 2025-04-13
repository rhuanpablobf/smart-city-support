
import React, { useEffect, useState } from 'react';
import { User, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

interface ChatHeaderProps {
  conversation?: Conversation;
  departmentName?: string;
  serviceName?: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  conversation,
  departmentName: propDepartmentName,
  serviceName: propServiceName,
  onBackClick,
  showBackButton = false 
}) => {
  const [departmentName, setDepartmentName] = useState<string | undefined>(propDepartmentName);
  const [serviceName, setServiceName] = useState<string | undefined>(propServiceName);

  useEffect(() => {
    const fetchDepartmentAndService = async () => {
      if (!conversation) return;
      
      // If we already have the names from props, don't fetch
      if (propDepartmentName && propServiceName) {
        setDepartmentName(propDepartmentName);
        setServiceName(propServiceName);
        return;
      }

      try {
        // Fetch department name
        if (conversation.department) {
          const { data: departmentData, error: deptError } = await supabase
            .from('departments')
            .select('name')
            .eq('id', conversation.department)
            .single();
            
          if (!deptError && departmentData) {
            setDepartmentName(departmentData.name);
          }
        }
        
        // Fetch service name
        if (conversation.service) {
          const { data: serviceData, error: servError } = await supabase
            .from('services')
            .select('name')
            .eq('id', conversation.service)
            .single();
            
          if (!servError && serviceData) {
            setServiceName(serviceData.name);
          }
        }
      } catch (error) {
        console.error('Error fetching department/service details:', error);
      }
    };

    fetchDepartmentAndService();
  }, [conversation, propDepartmentName, propServiceName]);

  return (
    <div className="flex items-center justify-between p-3 bg-chat-header border-b">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBackClick} className="mr-2 md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
        )}

        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        
        <div className="ml-3">
          <div className="font-medium">{conversation?.userName || 'Chat'}</div>
          <div className="text-xs text-gray-500">
            {departmentName && serviceName 
              ? `${departmentName} / ${serviceName}` 
              : conversation?.status === 'waiting' 
                ? 'Aguardando atendimento...'
                : conversation?.isBot 
                  ? 'Chatbot' 
                  : 'Online'}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-1">
        <Button variant="ghost" size="icon" disabled>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" disabled>
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
