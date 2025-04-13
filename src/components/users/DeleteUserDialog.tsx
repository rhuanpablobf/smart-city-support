
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserRole } from '@/types/auth';

interface DeleteUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUser: User | null;
  handleDeleteUser: () => void;
  getRoleName: (role: UserRole) => string;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  setIsOpen,
  currentUser,
  handleDeleteUser,
  getRoleName,
}) => {
  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este usuário? Esta ação é irreversível.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>
            <span className="font-semibold">Nome:</span> {currentUser.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {currentUser.email}
          </p>
          <p>
            <span className="font-semibold">Função:</span>{' '}
            {getRoleName(currentUser.role)}
          </p>
          {currentUser.secretaryName && (
            <p>
              <span className="font-semibold">Secretaria:</span>{' '}
              {currentUser.secretaryName}
            </p>
          )}
          {currentUser.departmentName && (
            <p>
              <span className="font-semibold">Departamento:</span>{' '}
              {currentUser.departmentName}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
