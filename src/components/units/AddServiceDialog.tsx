
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/services/base/supabaseBase';
import { addService } from '@/services/unitsService';

interface AddServiceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  departmentId: string | null;
  onSuccess: () => void;
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  setIsOpen,
  departmentId,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get department name when departmentId changes or dialog opens
  useEffect(() => {
    if (isOpen && departmentId) {
      const getDepartmentName = async () => {
        const { data, error } = await supabase
          .from('departments')
          .select('name')
          .eq('id', departmentId)
          .single();

        if (!error && data) {
          setDepartmentName(data.name);
        }
      };
      getDepartmentName();
    }
  }, [isOpen, departmentId]);

  const handleAdd = async () => {
    if (!name.trim() || !departmentId) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await addService(name, departmentId, description || null);
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
          <DialogTitle>Adicionar Novo Serviço</DialogTitle>
          <DialogDescription>
            Adicione um novo serviço à unidade {departmentName}
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
            onClick={handleAdd}
            disabled={isSubmitting || !name.trim() || !departmentId}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
