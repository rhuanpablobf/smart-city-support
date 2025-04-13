
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Clock, Star } from 'lucide-react';

interface KPICardsProps {
  kpiData: {
    total_attendances: number;
    total_growth: string;
    response_time: string;
    response_time_change: string;
    satisfaction: number;
    satisfaction_change: string;
  };
  isLoading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpiData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Atendimentos Totais
          </CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiData.total_attendances}</div>
          <p className="text-xs text-green-500 flex items-center">
            {kpiData.total_growth} em relação ao período anterior
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
          <div className="text-2xl font-bold">{kpiData.response_time}</div>
          <p className="text-xs text-green-500 flex items-center">
            {kpiData.response_time_change} em relação ao período anterior
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
          <div className="text-2xl font-bold">{kpiData.satisfaction}/5</div>
          <p className="text-xs text-green-500 flex items-center">
            {kpiData.satisfaction_change} em relação ao período anterior
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
