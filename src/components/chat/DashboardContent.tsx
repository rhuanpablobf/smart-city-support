
import React from 'react';
import { User } from '@/types/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatOperations from './ChatOperations';
import ConversationAudit from '@/components/audit/ConversationAudit';
import ChatInterface from './ChatInterface';

interface DashboardContentProps {
  chatOperationsProps: React.ComponentProps<typeof ChatOperations>;
  currentUser: User | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  chatOperationsProps,
  currentUser
}) => {
  const isUser = currentUser?.role === 'user' || !currentUser;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'secretary_admin';
  const isAgent = currentUser?.role === 'agent' || currentUser?.role === 'manager';

  if (isUser) {
    return <ChatInterface />;
  }

  if (isAgent || isAdmin) {
    return (
      <Tabs defaultValue="conversations" className="h-full flex flex-col">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="conversations">Conversas</TabsTrigger>
            {isAdmin && <TabsTrigger value="audit">Auditoria</TabsTrigger>}
          </TabsList>
        </div>
        
        <TabsContent value="conversations" className="flex-1 flex overflow-hidden p-0">
          <ChatOperations {...chatOperationsProps} />
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="audit" className="flex-1 overflow-auto p-0">
            <ConversationAudit />
          </TabsContent>
        )}
      </Tabs>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg text-gray-500">Acesso não autorizado</p>
    </div>
  );
};

export default DashboardContent;
