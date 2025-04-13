
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserRole } from '@/types/auth';
import { toast } from 'sonner';

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
  isSubmitting?: boolean;
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
  isSubmitting = false,
}) => {
  const [localUser, setLocalUser] = useState<User | null>(null);
  
  // Update local state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setLocalUser({ ...currentUser });
    }
  }, [currentUser]);

  if (!localUser) {
    return null;
  }

  const updateField = (field: keyof User, value: any) => {
    setLocalUser(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = () => {
    if (!localUser) return;
    
    // Validate required fields
    if (!localUser.name || !localUser.email) {
      toast.error('Nome e email são campos obrigatórios');
      return;
    }
    
    // Validate secretary selection for specific roles
    if ((localUser.role === 'secretary_admin' || localUser.role === 'manager' || localUser.role === 'agent') 
        && !localUser.secretaryId) {
      toast.error('Seleção de Secretaria é obrigatória para esta função');
      return;
    }
    
    // Validate department selection for specific roles
    if ((localUser.role === 'manager' || localUser.role === 'agent') 
        && !localUser.departmentId && localUser.secretaryId) {
      toast.error('Seleção de Departamento é obrigatória para esta função');
      return;
    }
    
    try {
      // Update the parent component's state by providing the updated user
      if (currentUser) {
        Object.assign(currentUser, localUser);
      }
      
      handleEditUser();
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
      console.error('Error updating user:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        setIsOpen(open);
      }
    }}>
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
              value={localUser.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={localUser.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Função</Label>
            <Select
              value={localUser.role}
              onValueChange={(value: UserRole) => updateField('role', value)}
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

          {(localUser.role === 'secretary_admin' || localUser.role === 'manager' || localUser.role === 'agent') && (
            <div className="grid gap-2">
              <Label htmlFor="edit-secretary">Secretaria</Label>
              <Select 
                value={localUser.secretaryId || ''}
                onValueChange={(value) => {
                  // Update local state
                  const secretary = availableSecretaries.find(s => s.id === value);
                  updateField('secretaryId', value);
                  updateField('secretaryName', secretary ? secretary.name : null);
                  
                  // Clear department if secretary changes
                  updateField('departmentId', null);
                  updateField('departmentName', null);
                  
                  // Also update parent state for filtered departments
                  updateCurrentUserSecretary(value);
                }}
                disabled={!isAdmin && localUser.role === 'secretary_admin'}
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

          {(localUser.role === 'manager' || localUser.role === 'agent') && localUser.secretaryId && (
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Departamento</Label>
              <Select 
                value={localUser.departmentId || ''}
                onValueChange={(value) => {
                  // Update local state  
                  const department = mockDepartments.find(d => d.id === value);
                  updateField('departmentId', value);
                  updateField('departmentName', department ? department.name : null);
                  
                  // Also update parent state
                  updateCurrentUserDepartment(value);
                }}
                disabled={isManager && localUser.role !== 'agent'}
              >
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments
                    .filter(d => d.secretaryId === localUser.secretaryId)
                    .map(department => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {localUser.role === 'agent' && (
            <div className="grid gap-2">
              <Label htmlFor="edit-chats">Atendimentos Simultâneos</Label>
              <Input
                id="edit-chats"
                type="number"
                min={1}
                max={10}
                value={localUser.maxConcurrentChats || 1}
                onChange={(e) => updateField('maxConcurrentChats', parseInt(e.target.value, 10) || 1)}
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
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
