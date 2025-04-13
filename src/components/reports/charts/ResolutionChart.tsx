
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartContainer } from '../ChartContainer';

interface ResolutionChartProps {
  resolutionData: { name: string; value: number }[];
}

export const ResolutionChart: React.FC<ResolutionChartProps> = ({
  resolutionData
}) => {
  const RESOLUTION_COLORS = ['#2196F3', '#673AB7'];

  return (
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
  );
};
