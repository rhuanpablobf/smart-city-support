
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  fetchDepartmentStats, 
  fetchServiceStats, 
  fetchAgentPerformance 
} from '@/services/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { KPICards } from '@/components/reports/KPICards';
import { OverviewTab } from '@/components/reports/OverviewTab';
import { DepartmentsTab } from '@/components/reports/DepartmentsTab';
import { AgentsTab } from '@/components/reports/AgentsTab';

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('week');

  // Fetch data using React Query
  const { data: departmentStats, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departmentStats', period],
    queryFn: fetchDepartmentStats
  });

  const { data: serviceStats, isLoading: loadingServices } = useQuery({
    queryKey: ['serviceStats', period],
    queryFn: fetchServiceStats
  });

  const { data: agentPerformance, isLoading: loadingAgents } = useQuery({
    queryKey: ['agentPerformance', period],
    queryFn: fetchAgentPerformance
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Relatórios e Análises</h1>
          <p className="text-gray-500">
            Visualize estatísticas e métricas de desempenho
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <KPICards />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="departments">Secretarias</TabsTrigger>
          <TabsTrigger value="agents">Atendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <DepartmentsTab 
            departmentStats={departmentStats}
            loadingDepartments={loadingDepartments}
          />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <AgentsTab 
            agentPerformance={agentPerformance}
            loadingAgents={loadingAgents}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
