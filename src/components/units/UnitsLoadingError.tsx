
import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnitsLoadingErrorProps {
  isLoading: boolean;
  loadError: string | null;
  onRefresh: () => void;
}

const UnitsLoadingError: React.FC<UnitsLoadingErrorProps> = ({
  isLoading,
  loadError,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando estrutura organizacional...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <AlertCircle className="h-6 w-6 mr-2" />
        <span>{loadError}</span>
        <Button variant="outline" size="sm" className="ml-4" onClick={onRefresh}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return null;
};

export default UnitsLoadingError;
