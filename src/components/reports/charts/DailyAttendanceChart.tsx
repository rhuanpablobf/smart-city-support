
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '../ChartContainer';

interface DailyAttendanceChartProps {
  attendanceData: { name: string; total: number; bot: number; human: number }[];
}

export const DailyAttendanceChart: React.FC<DailyAttendanceChartProps> = ({
  attendanceData
}) => {
  return (
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
  );
};
