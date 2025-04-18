
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchSecretaries, addDepartment } from '@/services/unitsService';
import { toast } from 'sonner';

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
  const [error, setError] = useState<string | null>(null);

  // Get secretary name when secretaryId changes or dialog opens
  useEffect(() => {
    if (isOpen && secretaryId) {
      setError(null);
      const getSecretaryName = async () => {
        try {
          const secretaries = await fetchSecretaries();
          const secretary = secretaries.find((s: any) => s.id === secretaryId);
          if (secretary) {
            setSecretaryName(secretary.name);
          } else {
            console.error("Secretary not found:", secretaryId);
            setError("Secretaria não encontrada");
          }
        } catch (err) {
          console.error("Error fetching secretary:", err);
          setError("Erro ao carregar informações da secretaria");
        }
      };
      getSecretaryName();
    }
  }, [isOpen, secretaryId]);

  const handleAdd = async () => {
    // Validate input
    if (!name.trim()) {
      setError("Por favor, insira o nome da unidade");
      return;
    }
    
    if (!secretaryId) {
      setError("Selecione uma secretaria primeiro");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const result = await addDepartment(name, secretaryId);
      
      if (result) {
        // Reset form and close dialog
        toast.success('Unidade adicionada com sucesso');
        setName('');
        setIsOpen(false);
        onSuccess();
      } else {
        // Handle case where department wasn't added
        setError("Não foi possível adicionar a unidade. Tente novamente.");
      }
    } catch (err) {
      console.error("Error adding department:", err);
      
      // Provide more specific error handling
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Erro desconhecido ao adicionar unidade";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!isSubmitting) {
          setIsOpen(open);
          if (!open) {
            setName('');
            setError(null);
          }
        }
      }}
    >
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
          
          {error && (
            <div className="text-sm text-red-500 mt-1">
              {error}
            </div>
          )}
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
