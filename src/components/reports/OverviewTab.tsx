
import React from 'react';
import { ChartContainer } from './ChartContainer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OverviewTabProps {
  attendanceData: { name: string; total: number; bot: number; human: number }[];
  responseTimeData: { name: string; avg: number }[];
  satisfactionData: { name: string; value: number }[];
  resolutionData: { name: string; value: number }[];
  isLoading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  attendanceData,
  responseTimeData,
  satisfactionData,
  resolutionData,
  isLoading,
}) => {
  const COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
  const RESOLUTION_COLORS = ['#2196F3', '#673AB7'];

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartContainer
        title="Atendimentos por Dia"
        description="Total de atendimentos divididos por bot e humano"
      >
        <BarChart data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bot" fill="#2196F3" name="Bot" />
          <Bar dataKey="human" fill="#673AB7" name="Humano" />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        title="Tempo Médio de Resposta"
        description="Em segundos, por dia da semana"
      >
        <LineChart data={responseTimeData}>
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
        </LineChart>
      </ChartContainer>

      <ChartContainer
        title="Avaliação de Satisfação"
        description="Distribuição das avaliações dos usuários"
      >
        <PieChart>
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
        </PieChart>
      </ChartContainer>

      <ChartContainer
        title="Resolução de Atendimentos"
        description="Proporção de atendimentos resolvidos por bot vs humano"
      >
        <PieChart>
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
        </PieChart>
      </ChartContainer>
    </div>
  );
};
