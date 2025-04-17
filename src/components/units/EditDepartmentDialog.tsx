
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateDepartment } from '@/services/unitsService';

interface EditDepartmentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  department: { id: string; name: string; secretary_id: string } | null;
  onSuccess: () => void;
}

const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({
  isOpen,
  setIsOpen,
  department,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && department) {
      setName(department.name);
    }
  }, [isOpen, department]);

  const handleUpdate = async () => {
    if (!name.trim() || !department) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateDepartment(department.id, name);
      if (result) {
        setName('');
        setIsOpen(false);
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        setIsOpen(open);
        if (!open) setName('');
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Unidade</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da unidade
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="department-name">Nome da Unidade</Label>
            <Input
              id="department-name"
              placeholder="Nome da unidade"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={isSubmitting || !name.trim() || !department}
          >
            {isSubmitting ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
