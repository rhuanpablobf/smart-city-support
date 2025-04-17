
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateService } from '@/services/unitsService';

interface EditServiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  service: { id: string; name: string; description: string | null } | null;
  onSuccess: () => void;
}

const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  isOpen,
  setIsOpen,
  service,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && service) {
      setName(service.name);
      setDescription(service.description || '');
    }
  }, [isOpen, service]);

  const handleUpdate = async () => {
    if (!name.trim() || !service) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateService(
        service.id, 
        name,
        description.trim() ? description : null
      );
      
      if (result) {
        setName('');
        setDescription('');
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
        if (!open) {
          setName('');
          setDescription('');
        }
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>
            Atualize os detalhes do serviço
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="service-name">Nome do Serviço</Label>
            <Input
              id="service-name"
              placeholder="Nome do serviço"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="service-description">Descrição (opcional)</Label>
            <Textarea
              id="service-description"
              placeholder="Descrição do serviço"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
            disabled={isSubmitting || !name.trim() || !service}
          >
            {isSubmitting ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
