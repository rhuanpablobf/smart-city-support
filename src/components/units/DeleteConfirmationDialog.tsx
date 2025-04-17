
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemType: 'secretary' | 'department' | 'service' | 'question';
  itemName: string;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  setIsOpen,
  itemType,
  itemName,
  onConfirm,
}) => {
  const itemTypeInPortuguese = {
    'secretary': 'secretaria',
    'department': 'unidade',
    'service': 'serviço',
    'question': 'pergunta e resposta'
  }[itemType];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Tem certeza que deseja excluir a {itemTypeInPortuguese}: <strong>{itemName}</strong>?
          {(itemType === 'secretary' || itemType === 'department') && (
            <p className="mt-2 text-red-500">
              Atenção: Todos os itens associados também serão excluídos.
            </p>
          )}
        </DialogDescription>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
          >
            Sim, excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
