
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Clock, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { QueueItem } from '@/types/chat';
import { subscribeToConversations } from '@/services/conversationService';
import { toast } from 'sonner';
import { supabase } from '@/services/base/supabaseBase';

interface QueueManagementProps {
  onSelectConversation: (conversationId: string) => void;
  activeConversations: number;
}

const QueueManagement: React.FC<QueueManagementProps> = ({ 
  onSelectConversation, 
  activeConversations 
}) => {
  const { authState } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Maximum number of concurrent chats this attendant can handle
  const maxConcurrentChats = authState.user?.maxConcurrentChats || 5;
  
  // Calculate waiting time in minutes
  const getWaitingTime = (startTime: Date): number => {
    const diffMs = new Date().getTime() - startTime.getTime();
    return Math.floor(diffMs / 60000); // Convert ms to minutes
  };
  
  const fetchQueue = async () => {
    setLoading(true);
    try {
      // Get conversations that are in waiting status
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('status', 'waiting')
        .order('started_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching queue:', error);
        throw error;
      }
      
      if (conversations) {
        // Map to queue items
        const queueItems: QueueItem[] = conversations.map((conv, index) => ({
          conversationId: conv.id,
          userId: conv.user_id,
          userName: conv.user_name,
          departmentId: conv.department_id,
          serviceId: conv.service_id,
          waitingSince: new Date(conv.started_at),
          position: index + 1,
          estimatedWaitTime: (index + 1) * 5, // 5 minutes per position estimation
        }));
        
        setQueue(queueItems);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQueue();
    
    // Subscribe to conversation updates to update queue
    const unsubscribe = subscribeToConversations((updatedConversation) => {
      if (updatedConversation.status === 'active' || updatedConversation.status === 'waiting') {
        fetchQueue();
      }
    });
    
    // Set up interval to refresh queue
    const interval = setInterval(fetchQueue, 60000); // Refresh every minute
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);
  
  const handleAcceptNext = async () => {
    if (queue.length === 0) {
      toast.info('Não há clientes na fila de espera.');
      return;
    }
    
    if (activeConversations >= maxConcurrentChats) {
      toast.warning(`Você já atingiu o limite de ${maxConcurrentChats} atendimentos simultâneos.`);
      return;
    }
    
    const nextInQueue = queue[0];
    
    try {
      // Update in database that agent accepts this conversation
      const { error } = await supabase
        .from('conversations')
        .update({ 
          status: 'active',
          agent_id: authState.user?.id 
        })
        .eq('id', nextInQueue.conversationId);
        
      if (error) {
        console.error('Error accepting conversation:', error);
        toast.error('Erro ao aceitar conversa.');
        return;
      }
      
      onSelectConversation(nextInQueue.conversationId);
      setQueue(prev => prev.slice(1).map((item, i) => ({ ...item, position: i + 1 })));
      toast.success(`Você aceitou o atendimento de ${nextInQueue.userName}`);
    } catch (error) {
      console.error('Error accepting conversation:', error);
      toast.error('Erro ao aceitar conversa.');
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium flex items-center">
            <User className="mr-2 h-4 w-4" /> 
            Gerenciamento de Fila
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Atendimentos ativos: {activeConversations}/{maxConcurrentChats}
            </div>
            <Progress 
              value={(activeConversations / maxConcurrentChats) * 100} 
              className="w-1/2 h-2" 
            />
          </div>
          
          <Button 
            variant="default" 
            className="w-full" 
            disabled={activeConversations >= maxConcurrentChats || queue.length === 0}
            onClick={handleAcceptNext}
          >
            <UserCheck className="mr-2 h-4 w-4" /> 
            Aceitar Próximo na Fila
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">
            Fila de Espera ({queue.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>Não há clientes na fila de espera</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <div key={item.conversationId} className="p-2 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{item.userName}</div>
                    <div className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      Posição: {item.position}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.estimatedWaitTime} min de espera
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueManagement;
