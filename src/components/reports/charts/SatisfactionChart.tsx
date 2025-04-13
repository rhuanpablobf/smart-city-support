
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartContainer } from '../ChartContainer';

interface SatisfactionChartProps {
  satisfactionData: { name: string; value: number }[];
}

export const SatisfactionChart: React.FC<SatisfactionChartProps> = ({
  satisfactionData
}) => {
  const COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];

  return (
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
  );
};
