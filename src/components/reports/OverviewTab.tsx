
import React from 'react';
import { DailyAttendanceChart } from './charts/DailyAttendanceChart';
import { ResponseTimeChart } from './charts/ResponseTimeChart';
import { SatisfactionChart } from './charts/SatisfactionChart';
import { ResolutionChart } from './charts/ResolutionChart';
import { LoadingSpinner } from './LoadingSpinner';

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
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DailyAttendanceChart attendanceData={attendanceData} />
      <ResponseTimeChart responseTimeData={responseTimeData} />
      <SatisfactionChart satisfactionData={satisfactionData} />
      <ResolutionChart resolutionData={resolutionData} />
    </div>
  );
};
