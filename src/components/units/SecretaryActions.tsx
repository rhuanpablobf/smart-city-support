
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface SecretaryActionsProps {
  secretary: { id: string; name: string };
  onEdit: (secretary: { id: string; name: string }) => void;
  onDelete: (id: string, name: string) => void;
  onAddDepartment: (secretaryId: string) => void;
}

const SecretaryActions: React.FC<SecretaryActionsProps> = ({
  secretary,
  onEdit,
  onDelete,
  onAddDepartment,
}) => {
  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(secretary)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(secretary.id, secretary.name)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onAddDepartment(secretary.id);
        }}
      >
        <Plus className="h-3 w-3 mr-1" />
        Adicionar Unidade
      </Button>
    </div>
  );
};

export default SecretaryActions;
