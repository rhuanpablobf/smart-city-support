
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface DepartmentActionsProps {
  department: {
    id: string;
    name: string;
    secretary_id: string;
  };
  onEdit: (department: { id: string; name: string; secretary_id: string }) => void;
  onDelete: (id: string, name: string) => void;
  onAddService: (departmentId: string) => void;
  onlineAttendants?: number;
}

const DepartmentActions: React.FC<DepartmentActionsProps> = ({
  department,
  onEdit,
  onDelete,
  onAddService,
  onlineAttendants = 0
}) => {
  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(department)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(department.id, department.name)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onAddService(department.id);
        }}
      >
        <Plus className="h-3 w-3 mr-1" />
        Adicionar Serviço
      </Button>
      
      {onlineAttendants > 0 && (
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          {onlineAttendants} online
        </div>
      )}
    </div>
  );
};

export default DepartmentActions;
