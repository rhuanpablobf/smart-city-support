
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface UnitsHeaderProps {
  loadError: string | null;
  onRefresh: () => void;
  onAddSecretary: () => void;
}

const UnitsHeader: React.FC<UnitsHeaderProps> = ({
  loadError,
  onRefresh,
  onAddSecretary,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Gestão de Unidades e Serviços</h1>
        <p className="text-gray-500">
          Gerencie secretarias, unidades e serviços no sistema
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
        {loadError && (
          <Button variant="outline" onClick={onRefresh} className="mr-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        )}
        <Button onClick={onAddSecretary}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Secretaria
        </Button>
      </div>
    </div>
  );
};

export default UnitsHeader;
