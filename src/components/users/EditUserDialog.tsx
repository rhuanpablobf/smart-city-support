
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserRole } from '@/types/auth';

interface Department {
  id: string;
  name: string;
  secretaryId: string;
}

interface Secretary {
  id: string;
  name: string;
}

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUser: User | null;
  handleEditUser: () => void;
  getAvailableRoles: () => UserRole[];
  getRoleName: (role: UserRole) => string;
  availableSecretaries: Secretary[];
  isAdmin: boolean;
  isManager: boolean;
  mockDepartments: Department[];
  updateCurrentUserSecretary: (value: string) => void;
  updateCurrentUserDepartment: (value: string) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  setIsOpen,
  currentUser,
  handleEditUser,
  getAvailableRoles,
  getRoleName,
  availableSecretaries,
  isAdmin,
  isManager,
  mockDepartments,
  updateCurrentUserSecretary,
  updateCurrentUserDepartment,
}) => {
  if (!currentUser) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os detalhes do usuário
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              value={currentUser.name}
              onChange={(e) =>
                currentUser && updateCurrentUserDepartment(e.target.value)
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={currentUser.email}
              onChange={(e) =>
                currentUser && updateCurrentUserDepartment(e.target.value)
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Função</Label>
            <Select
              value={currentUser.role}
              onValueChange={(value: UserRole) =>
                currentUser && updateCurrentUserDepartment(value)
              }
              disabled={!isAdmin}
            >
              <SelectTrigger id="edit-role">
                <SelectValue />
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

          {(currentUser.role === 'secretary_admin' || currentUser.role === 'manager' || currentUser.role === 'agent') && (
            <div className="grid gap-2">
              <Label htmlFor="edit-secretary">Secretaria</Label>
              <Select 
                value={currentUser.secretaryId || ''}
                onValueChange={(value) => updateCurrentUserSecretary(value)}
                disabled={!isAdmin && currentUser.role === 'secretary_admin'}
              >
                <SelectTrigger id="edit-secretary">
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

          {(currentUser.role === 'manager' || currentUser.role === 'agent') && currentUser.secretaryId && (
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Departamento</Label>
              <Select 
                value={currentUser.departmentId || ''}
                onValueChange={(value) => updateCurrentUserDepartment(value)}
                disabled={isManager && currentUser.role !== 'agent'}
              >
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments
                    .filter(d => d.secretaryId === currentUser.secretaryId)
                    .map(department => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentUser.role === 'agent' && (
            <div className="grid gap-2">
              <Label htmlFor="edit-chats">Atendimentos Simultâneos</Label>
              <Input
                id="edit-chats"
                type="number"
                min={1}
                max={10}
                value={currentUser.maxConcurrentChats}
                onChange={(e) =>
                  currentUser && updateCurrentUserDepartment(parseInt(e.target.value))
                }
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEditUser}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
