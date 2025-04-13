
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '../ChartContainer';

interface ResponseTimeChartProps {
  responseTimeData: { name: string; avg: number }[];
}

export const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({
  responseTimeData
}) => {
  return (
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
  );
};
