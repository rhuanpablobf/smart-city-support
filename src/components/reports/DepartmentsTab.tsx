
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
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { DepartmentStats } from '@/types/reports';

interface DepartmentsTabProps {
  departmentStats: DepartmentStats[] | undefined;
  loadingDepartments: boolean;
}

export const DepartmentsTab: React.FC<DepartmentsTabProps> = ({
  departmentStats,
  loadingDepartments,
}) => {
  // Use the data from the API or empty arrays if still loading
  const topDepartmentsData = departmentStats
    ? [...departmentStats]
        .sort((a, b) => b.totalConversations - a.totalConversations)
        .slice(0, 5)
    : [];

  if (loadingDepartments) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${(Number(value) * 100).toFixed(1)}%`,
                      'Taxa de resolução',
                    ]}
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
            <CardDescription>Em segundos, por secretaria</CardDescription>
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
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}s`, 'Tempo de espera']}
                  />
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
    </>
  );
};
