import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateSecretary } from '@/services/units';

interface EditSecretaryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  secretary: { id: string; name: string } | null;
  onSuccess: () => void;
}

const EditSecretaryDialog: React.FC<EditSecretaryDialogProps> = ({
  isOpen,
  setIsOpen,
  secretary,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && secretary) {
      setName(secretary.name);
    }
  }, [isOpen, secretary]);

  const handleUpdate = async () => {
    if (!name.trim() || !secretary) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateSecretary(secretary.id, name);
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
          <DialogTitle>Editar Secretaria</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da secretaria
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="secretary-name">Nome da Secretaria</Label>
            <Input
              id="secretary-name"
              placeholder="Nome da secretaria"
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
            disabled={isSubmitting || !name.trim() || !secretary}
          >
            {isSubmitting ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSecretaryDialog;
