
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Clock, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { QueueItem } from '@/types/chat';
import { subscribeToConversations } from '@/services/conversationService';
import { toast } from 'sonner';

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
  
  useEffect(() => {
    const fetchQueue = async () => {
      setLoading(true);
      try {
        // In production, this would be a real API call to fetch the queue
        // Mocking queue data for now
        const mockQueue: QueueItem[] = Array(5).fill(null).map((_, i) => ({
          conversationId: `conversation-${i}`,
          userId: `user-${i}`,
          userName: `Cliente ${i + 1}`,
          departmentId: 'dept1',
          serviceId: 'service1',
          waitingSince: new Date(Date.now() - (i * 5 * 60000)), // 5 minutes intervals
          position: i + 1,
          estimatedWaitTime: (i + 1) * 5, // 5 minutes per position
        }));
        
        setQueue(mockQueue);
      } catch (error) {
        console.error('Error fetching queue:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueue();
    
    // Subscribe to conversation updates to update queue
    const unsubscribe = subscribeToConversations((updatedConversation) => {
      // In production, fetch queue again when conversation status changes
      if (updatedConversation.status === 'active' || updatedConversation.status === 'waiting') {
        fetchQueue();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  const handleAcceptNext = () => {
    if (queue.length === 0) {
      toast.info('Não há clientes na fila de espera.');
      return;
    }
    
    if (activeConversations >= maxConcurrentChats) {
      toast.warning(`Você já atingiu o limite de ${maxConcurrentChats} atendimentos simultâneos.`);
      return;
    }
    
    const nextInQueue = queue[0];
    onSelectConversation(nextInQueue.conversationId);
    
    // Remove from queue (in production, this would be handled by the backend)
    setQueue(prev => prev.slice(1).map((item, i) => ({ ...item, position: i + 1 })));
    
    toast.success(`Você aceitou o atendimento de ${nextInQueue.userName}`);
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
