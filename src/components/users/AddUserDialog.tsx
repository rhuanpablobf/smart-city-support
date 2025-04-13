
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserRole } from '@/types/auth';

interface Secretary {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  secretaryId: string;
}

interface AddUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newUser: Partial<User>;
  setNewUser: (user: Partial<User>) => void;
  handleAddUser: () => void;
  getAvailableRoles: () => UserRole[];
  getRoleName: (role: UserRole) => string;
  availableSecretaries: Secretary[];
  availableDepartments: Department[];
  selectedSecretaryId: string | null;
  handleSecretaryChange: (value: string) => void;
  handleDepartmentChange: (value: string) => void;
  isSubmitting?: boolean;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  setIsOpen,
  newUser,
  setNewUser,
  handleAddUser,
  getAvailableRoles,
  getRoleName,
  availableSecretaries,
  availableDepartments,
  selectedSecretaryId,
  handleSecretaryChange,
  handleDepartmentChange,
  isSubmitting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        setIsOpen(open);
      }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para adicionar um novo usuário ao sistema
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Nome completo"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select
              value={newUser.role}
              onValueChange={(value: UserRole) =>
                setNewUser({ ...newUser, role: value })
              }
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableRoles().map(role => (
                  <SelectItem key={role} value={role}>
                    {getRoleName(role as UserRole)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(newUser.role === 'secretary_admin' || newUser.role === 'manager' || newUser.role === 'agent') && (
            <div className="grid gap-2">
              <Label htmlFor="secretary">Secretaria</Label>
              <Select 
                value={newUser.secretaryId || ''}
                onValueChange={(value) => handleSecretaryChange(value)}
              >
                <SelectTrigger id="secretary">
                  <SelectValue placeholder="Selecione a secretaria" />
                </SelectTrigger>
                <SelectContent>
                  {availableSecretaries.map(secretary => (
                    <SelectItem key={secretary.id} value={secretary.id}>
                      {secretary.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(newUser.role === 'manager' || newUser.role === 'agent') && newUser.secretaryId && (
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={newUser.departmentId || ''}
                onValueChange={(value) => handleDepartmentChange(value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map(department => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(newUser.role === 'agent') && (
            <div className="grid gap-2">
              <Label htmlFor="chats">Atendimentos Simultâneos</Label>
              <Input
                id="chats"
                type="number"
                min={1}
                max={10}
                value={newUser.maxConcurrentChats}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    maxConcurrentChats: parseInt(e.target.value) || 1,
                  })
                }
              />
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
            onClick={handleAddUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
