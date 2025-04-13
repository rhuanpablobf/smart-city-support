
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart as LucideBarChart,
  BarChart3,
  Calendar,
  LineChart,
  PieChart,
  Users,
  Clock,
  Star,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from 'recharts';
import { mockAgentPerformance, mockDepartmentStats, mockServiceStats } from '@/services/mockData';

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('week');

  // Mock data for charts
  const attendanceData = [
    { name: 'Seg', total: 34, bot: 20, human: 14 },
    { name: 'Ter', total: 42, bot: 25, human: 17 },
    { name: 'Qua', total: 38, bot: 22, human: 16 },
    { name: 'Qui', total: 48, bot: 30, human: 18 },
    { name: 'Sex', total: 56, bot: 35, human: 21 },
    { name: 'Sáb', total: 22, bot: 15, human: 7 },
    { name: 'Dom', total: 18, bot: 12, human: 6 },
  ];

  const responseTimeData = [
    { name: 'Seg', avg: 45 },
    { name: 'Ter', avg: 52 },
    { name: 'Qua', avg: 38 },
    { name: 'Qui', avg: 42 },
    { name: 'Sex', avg: 35 },
    { name: 'Sáb', avg: 30 },
    { name: 'Dom', avg: 28 },
  ];

  const satisfactionData = [
    { name: '5 estrelas', value: 58 },
    { name: '4 estrelas', value: 24 },
    { name: '3 estrelas', value: 12 },
    { name: '2 estrelas', value: 4 },
    { name: '1 estrela', value: 2 },
  ];

  const COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];

  const resolutionData = [
    { name: 'Bot', value: 65 },
    { name: 'Humano', value: 35 },
  ];

  const RESOLUTION_COLORS = ['#2196F3', '#673AB7'];

  const topDepartmentsData = mockDepartmentStats.sort((a, b) => b.totalConversations - a.totalConversations).slice(0, 5);
  const topServicesData = mockServiceStats.sort((a, b) => b.totalConversations - a.totalConversations).slice(0, 5);
  const agentPerformanceData = mockAgentPerformance.sort((a, b) => b.satisfactionRate - a.satisfactionRate);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Atendimentos Totais
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-green-500 flex items-center">
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo Médio de Resposta
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38s</div>
            <p className="text-xs text-green-500 flex items-center">
              -5s em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfação do Usuário
            </CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-green-500 flex items-center">
              +0.2 em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="departments">Secretarias</TabsTrigger>
          <TabsTrigger value="agents">Atendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atendimentos por Dia</CardTitle>
                <CardDescription>
                  Total de atendimentos divididos por bot e humano
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bot" fill="#2196F3" name="Bot" />
                      <Bar dataKey="human" fill="#673AB7" name="Humano" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Resposta</CardTitle>
                <CardDescription>
                  Em segundos, por dia da semana
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#2196F3"
                        activeDot={{ r: 8 }}
                        name="Tempo médio (s)"
                      />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avaliação de Satisfação</CardTitle>
                <CardDescription>
                  Distribuição das avaliações dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          index,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor={x > cx ? 'start' : 'end'}
                              dominantBaseline="central"
                            >
                              {`${satisfactionData[index].name} ${(
                                percent * 100
                              ).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {satisfactionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolução de Atendimentos</CardTitle>
                <CardDescription>
                  Proporção de atendimentos resolvidos por bot vs humano
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={resolutionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {resolutionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={RESOLUTION_COLORS[index % RESOLUTION_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Secretaria</CardTitle>
              <CardDescription>
                Total de atendimentos e taxas de resolução por secretaria
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topDepartmentsData}
                    layout="vertical"
                    margin={{ left: 120 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="departmentName"
                      type="category"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Resolução via Bot</CardTitle>
                <CardDescription>
                  Percentual de atendimentos resolvidos automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topDepartmentsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="departmentName" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60} 
                        tick={{fontSize: 12}}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Taxa de resolução']}
                      />
                      <Bar
                        dataKey="botResolutionRate"
                        fill="#4CAF50"
                        name="Taxa de Resolução via Bot"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Espera</CardTitle>
                <CardDescription>
                  Em segundos, por secretaria
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topDepartmentsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="departmentName" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                        tick={{fontSize: 12}} 
                      />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}s`, 'Tempo de espera']} />
                      <Bar
                        dataKey="avgWaitTime"
                        fill="#FF9800"
                        name="Tempo Médio de Espera (s)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho dos Atendentes</CardTitle>
              <CardDescription>
                Métricas de desempenho por atendente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Atendente
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Tempo de Resposta
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Tempo de Atendimento
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Satisfação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformanceData.map((agent) => (
                      <tr key={agent.agentId} className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">
                          {agent.agentName}
                        </td>
                        <td className="px-6 py-4">
                          {agent.totalConversations}
                        </td>
                        <td className="px-6 py-4">
                          {agent.avgResponseTime}s
                        </td>
                        <td className="px-6 py-4">
                          {(agent.avgHandlingTime / 60).toFixed(1)} min
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {agent.satisfactionRate}
                            <Star className="h-4 w-4 text-yellow-500 ml-1" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total de Atendimentos</CardTitle>
                <CardDescription>
                  Por atendente no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agentPerformanceData}>
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
                <CardDescription>
                  Em segundos, por atendente
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agentPerformanceData}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
