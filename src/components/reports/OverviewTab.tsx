
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
  Legend,
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from 'recharts';

export const OverviewTab = () => {
  // Mock data for charts that don't have database equivalents yet
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

  return (
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
  );
};
