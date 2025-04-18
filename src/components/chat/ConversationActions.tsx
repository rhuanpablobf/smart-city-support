
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal,
  UserPlus,
  PhoneForwarded, 
  LogOut,
  Check
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { mockAgents } from '@/services/mockData';
import { Conversation } from '@/types/chat';
import { User } from '@/types/auth';

interface ConversationActionsProps {
  conversation: Conversation | undefined;
  onCloseConversation: (conversationId: string) => void;
  onTransferConversation: (conversationId: string, targetAgentId: string, targetDepartmentId?: string) => void;
  currentUser?: User | null;
}

const ConversationActions: React.FC<ConversationActionsProps> = ({
  conversation,
  onCloseConversation,
  onTransferConversation,
  currentUser
}) => {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [transferringToAgent, setTransferringToAgent] = useState(true);
  
  // Filter out current user from available agents
  const availableAgents = mockAgents.filter(agent => 
    agent.id !== currentUser?.id && 
    agent.isOnline && 
    agent.status === 'online'
  );

  const handleTransfer = () => {
    if (!conversation) return;
    
    if (transferringToAgent && !selectedAgentId) {
      toast.error('Selecione um atendente para transferir');
      return;
    }
    
    if (!transferringToAgent && !selectedDepartmentId) {
      toast.error('Selecione uma unidade para transferir');
      return;
    }
    
    // Execute the transfer
    onTransferConversation(
      conversation.id, 
      transferringToAgent ? selectedAgentId : '',
      !transferringToAgent ? selectedDepartmentId : undefined
    );
    
    setIsTransferDialogOpen(false);
    toast.success('Atendimento transferido com sucesso');
  };
  
  const handleCloseConversation = () => {
    if (!conversation) return;
    onCloseConversation(conversation.id);
    toast.success('Atendimento encerrado com sucesso');
  };
  
  if (!conversation) return null;
  
  // Only show actions for active conversations
  if (conversation.status !== 'active') return null;

  return (
    <>
      <div className="flex items-center gap-2 p-2 border-t">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleCloseConversation}
          className="flex-1"
        >
          <LogOut className="h-4 w-4 mr-1" /> 
          Encerrar Conversa
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsTransferDialogOpen(true)}>
              <PhoneForwarded className="h-4 w-4 mr-2" />
              Transferir
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCloseConversation} className="text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Encerrar Conversa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir Atendimento</DialogTitle>
            <DialogDescription>
              Transferir atendimento para outro atendente ou departamento
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant={transferringToAgent ? "default" : "outline"}
                onClick={() => setTransferringToAgent(true)}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Para Atendente
              </Button>
              <Button 
                variant={!transferringToAgent ? "default" : "outline"}
                onClick={() => setTransferringToAgent(false)}
                className="flex-1"
              >
                <PhoneForwarded className="h-4 w-4 mr-2" />
                Para Departamento
              </Button>
            </div>
            
            {transferringToAgent ? (
              <div className="grid gap-2">
                <label htmlFor="agent-select" className="text-sm font-medium">
                  Selecione o atendente
                </label>
                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                  <SelectTrigger id="agent-select">
                    <SelectValue placeholder="Selecione um atendente" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} - {agent.departmentName || 'Sem departamento'}
                      </SelectItem>
                    ))}
                    {availableAgents.length === 0 && (
                      <div className="text-center p-2 text-gray-500">
                        Nenhum atendente disponível
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <label htmlFor="department-select" className="text-sm font-medium">
                  Selecione o departamento
                </label>
                <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
                  <SelectTrigger id="department-select">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dep1">Atendimento (Saúde)</SelectItem>
                    <SelectItem value="dep2">Matrículas (Educação)</SelectItem>
                    <SelectItem value="dep3">Agendamentos (Saúde)</SelectItem>
                    <SelectItem value="iptu-dep">IPTU (SEFAZ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleTransfer}>
              <Check className="h-4 w-4 mr-2" /> Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationActions;
