
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { addSecretary } from '@/services/unitsService';
import { toast } from 'sonner';

interface AddSecretaryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const AddSecretaryDialog: React.FC<AddSecretaryDialogProps> = ({
  isOpen,
  setIsOpen,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('O nome da secretaria é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await addSecretary(name);
      if (result) {
        setName('');
        setIsOpen(false);
        onSuccess();
        toast.success('Secretaria adicionada com sucesso!');
      } else {
        setError('Erro ao adicionar secretaria. Tente novamente.');
      }
    } catch (err) {
      console.error('Error in handleAdd:', err);
      setError('Erro ao adicionar secretaria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setError(null);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Secretaria</DialogTitle>
          <DialogDescription>
            Adicione uma nova secretaria ao sistema
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
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSecretaryDialog;
