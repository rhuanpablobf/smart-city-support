
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchSecretaries, addDepartment } from '@/services/unitsService';

interface AddDepartmentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  secretaryId: string | null;
  onSuccess: () => void;
}

const AddDepartmentDialog: React.FC<AddDepartmentDialogProps> = ({
  isOpen,
  setIsOpen,
  secretaryId,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [secretaryName, setSecretaryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get secretary name when secretaryId changes or dialog opens
  useEffect(() => {
    if (isOpen && secretaryId) {
      const getSecretaryName = async () => {
        const secretaries = await fetchSecretaries();
        const secretary = secretaries.find((s: any) => s.id === secretaryId);
        if (secretary) {
          setSecretaryName(secretary.name);
        }
      };
      getSecretaryName();
    }
  }, [isOpen, secretaryId]);

  const handleAdd = async () => {
    if (!name.trim() || !secretaryId) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await addDepartment(name, secretaryId);
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
          <DialogTitle>Adicionar Nova Unidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova unidade à secretaria {secretaryName}
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
            onClick={handleAdd}
            disabled={isSubmitting || !name.trim() || !secretaryId}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentDialog;
