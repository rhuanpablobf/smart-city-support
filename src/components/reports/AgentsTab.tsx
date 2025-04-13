
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Star } from 'lucide-react';
import { AgentPerformance } from '@/types/reports';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AgentsTabProps {
  agentPerformance: AgentPerformance[] | undefined;
  loadingAgents: boolean;
}

export const AgentsTab: React.FC<AgentsTabProps> = ({
  agentPerformance,
  loadingAgents,
}) => {
  const sortedAgentPerformance = agentPerformance
    ? [...agentPerformance].sort((a, b) => b.satisfactionRate - a.satisfactionRate)
    : [];

  if (loadingAgents) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Desempenho dos Atendentes</CardTitle>
          <CardDescription>Métricas de desempenho por atendente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atendente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Tempo de Resposta</TableHead>
                  <TableHead>Tempo de Atendimento</TableHead>
                  <TableHead>Satisfação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAgentPerformance.map((agent) => (
                  <TableRow key={agent.agentId}>
                    <TableCell className="font-medium">
                      {agent.agentName}
                    </TableCell>
                    <TableCell>{agent.totalConversations}</TableCell>
                    <TableCell>{agent.avgResponseTime}s</TableCell>
                    <TableCell>
                      {(agent.avgHandlingTime / 60).toFixed(1)} min
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {agent.satisfactionRate}
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Atendimentos</CardTitle>
            <CardDescription>Por atendente no período selecionado</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedAgentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agentName" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="totalConversations"
                    fill="#2196F3"
                    name="Total de Atendimentos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Resposta</CardTitle>
            <CardDescription>Em segundos, por atendente</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedAgentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agentName" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}s`, 'Tempo médio']} />
                  <Bar
                    dataKey="avgResponseTime"
                    fill="#FF9800"
                    name="Tempo Médio (s)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
