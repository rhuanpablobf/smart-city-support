
import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash,
  Building,
  Users,
  UserCog,
  BriefcaseBusiness,
} from 'lucide-react';
import { mockAgents } from '@/services/mockData';
import { User, UserRole } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Mock departments and secretaries data
const mockSecretaries = [
  { id: 'sec1', name: 'Secretaria de Saúde' },
  { id: 'sec2', name: 'Secretaria de Educação' },
  { id: 'sec3', name: 'Secretaria de Finanças' },
];

const mockDepartments = [
  { id: 'dep1', name: 'Departamento de Consultas', secretaryId: 'sec1' },
  { id: 'dep2', name: 'Departamento de Vacinas', secretaryId: 'sec1' },
  { id: 'dep3', name: 'Departamento de Matrículas', secretaryId: 'sec2' },
  { id: 'dep4', name: 'Departamento de IPTU', secretaryId: 'sec3' },
];

const UsersManagement: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([...mockAgents]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [filterSecretaryId, setFilterSecretaryId] = useState<string | null>(null);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string | null>(null);
  
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'agent',
    secretaryId: null,
    secretaryName: null,
    departmentId: null,
    departmentName: null,
    maxConcurrentChats: 5,
  });

  const isAdmin = authState.user?.role === 'admin';
  const isSecretaryAdmin = authState.user?.role === 'secretary_admin';
  const isManager = authState.user?.role === 'manager';
  
  // Get available secretary options based on user role
  const availableSecretaries = useMemo(() => {
    if (isAdmin) {
      return mockSecretaries;
    } else if (isSecretaryAdmin && authState.user?.secretaryId) {
      return mockSecretaries.filter(s => s.id === authState.user?.secretaryId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, authState.user]);

  // Get available department options based on user role and selected secretary
  const availableDepartments = useMemo(() => {
    if (isAdmin || isSecretaryAdmin) {
      if (selectedSecretaryId) {
        return mockDepartments.filter(d => d.secretaryId === selectedSecretaryId);
      }
      return isSecretaryAdmin && authState.user?.secretaryId 
        ? mockDepartments.filter(d => d.secretaryId === authState.user?.secretaryId)
        : [];
    } else if (isManager && authState.user?.departmentId) {
      return mockDepartments.filter(d => d.id === authState.user?.departmentId);
    }
    return [];
  }, [isAdmin, isSecretaryAdmin, isManager, selectedSecretaryId, authState.user]);

  // Filter users based on search query and user access level
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by secretary if user is not admin
    if (!isAdmin) {
      if (isSecretaryAdmin && authState.user?.secretaryId) {
        result = result.filter(user => user.secretaryId === authState.user?.secretaryId);
      } else if (isManager && authState.user?.departmentId) {
        result = result.filter(user => user.departmentId === authState.user?.departmentId && user.role === 'agent');
      } else {
        // Agents can't see other users
        return [];
      }
    }

    // Apply search filter
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply secretary filter
    if (filterSecretaryId) {
      result = result.filter(user => user.secretaryId === filterSecretaryId);
      
      // Apply department filter
      if (filterDepartmentId) {
        result = result.filter(user => user.departmentId === filterDepartmentId);
      }
    }

    return result;
  }, [
    users,
    searchQuery,
    isAdmin,
    isSecretaryAdmin,
    isManager,
    authState.user,
    filterSecretaryId,
    filterDepartmentId
  ]);

  const handleAddUser = () => {
    // Validate inputs
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    // Validate secretary and department based on role
    if (newUser.role === 'secretary_admin' && !newUser.secretaryId) {
      toast.error('Administrador de secretaria precisa ter uma secretaria associada');
      return;
    }

    if (newUser.role === 'manager' && (!newUser.secretaryId || !newUser.departmentId)) {
      toast.error('Gerente precisa ter secretaria e departamento associados');
      return;
    }

    if (newUser.role === 'agent' && (!newUser.secretaryId || !newUser.departmentId)) {
      toast.error('Atendente precisa ter secretaria e departamento associados');
      return;
    }
    
    // Get secretary and department names
    let secretaryName = null;
    let departmentName = null;
    
    if (newUser.secretaryId) {
      const secretary = mockSecretaries.find(s => s.id === newUser.secretaryId);
      secretaryName = secretary ? secretary.name : null;
    }
    
    if (newUser.departmentId) {
      const department = mockDepartments.find(d => d.id === newUser.departmentId);
      departmentName = department ? department.name : null;
    }
    
    // Admin always starts with offline status
    const isOfflineByDefault = newUser.role === 'admin';
    
    // Create new user
    const user: User = {
      id: `user${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      isOnline: !isOfflineByDefault,
      status: isOfflineByDefault ? 'offline' : 'online',
      maxConcurrentChats: newUser.maxConcurrentChats || 5,
      secretaryId: newUser.secretaryId || null,
      secretaryName: secretaryName,
      departmentId: newUser.departmentId || null,
      departmentName: departmentName,
      avatar: '/placeholder.svg',
    };
    
    // Add user to list
    setUsers((prevUsers) => [...prevUsers, user]);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'agent',
      secretaryId: null,
      secretaryName: null,
      departmentId: null,
      departmentName: null,
      maxConcurrentChats: 5,
    });
    setSelectedSecretaryId(null);
    
    // Close dialog
    setIsAddDialogOpen(false);
    
    // Show success message
    toast.success('Usuário adicionado com sucesso');
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    
    // Update user
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === currentUser.id) {
          return currentUser;
        }
        return user;
      })
    );
    
    // Close dialog
    setIsEditDialogOpen(false);
    
    // Show success message
    toast.success('Usuário atualizado com sucesso');
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    // Remove user
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== currentUser.id)
    );
    
    // Close dialog
    setIsDeleteDialogOpen(false);
    
    // Show success message
    toast.success('Usuário removido com sucesso');
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setSelectedSecretaryId(user.secretaryId || null);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Get role name in Portuguese
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador Master';
      case 'secretary_admin':
        return 'Administrador de Secretaria';
      case 'manager':
        return 'Gerente';
      case 'agent':
        return 'Atendente';
      default:
        return 'Usuário';
    }
  };

  // Get role badge style
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'secretary_admin':
        return 'border-purple-200 bg-purple-50 text-purple-800';
      case 'manager':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'agent':
        return 'border-green-200 bg-green-50 text-green-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const handleSecretaryChange = (value: string, isFilter = false) => {
    if (isFilter) {
      setFilterSecretaryId(value);
      setFilterDepartmentId(null); // Reset department filter when secretary changes
    } else {
      setSelectedSecretaryId(value);
      setNewUser({
        ...newUser,
        secretaryId: value,
        secretaryName: mockSecretaries.find(s => s.id === value)?.name,
        departmentId: null, // Reset department when secretary changes
        departmentName: null,
      });
    }
  };

  const handleDepartmentChange = (value: string, isFilter = false) => {
    if (isFilter) {
      setFilterDepartmentId(value);
    } else {
      setNewUser({
        ...newUser,
        departmentId: value,
        departmentName: mockDepartments.find(d => d.id === value)?.name,
      });
    }
  };

  const updateCurrentUserSecretary = (value: string) => {
    if (!currentUser) return;
    
    const secretary = mockSecretaries.find(s => s.id === value);
    setCurrentUser({
      ...currentUser,
      secretaryId: value,
      secretaryName: secretary ? secretary.name : null,
      departmentId: null, // Reset department when secretary changes
      departmentName: null,
    });
    setSelectedSecretaryId(value);
  };

  const updateCurrentUserDepartment = (value: string) => {
    if (!currentUser) return;
    
    const department = mockDepartments.find(d => d.id === value);
    setCurrentUser({
      ...currentUser,
      departmentId: value,
      departmentName: department ? department.name : null,
    });
  };

  // Determine which roles current user can create
  const getAvailableRoles = () => {
    if (isAdmin) {
      return ['admin', 'secretary_admin', 'manager', 'agent'];
    } else if (isSecretaryAdmin) {
      return ['manager', 'agent'];
    } else if (isManager) {
      return ['agent'];
    }
    return [];
  };

  // Check if user can add new users
  const canAddUsers = isAdmin || isSecretaryAdmin || isManager;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestão de Usuários</h1>
          <p className="text-gray-500">
            Adicione, edite ou remova usuários do sistema
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários..."
              className="pl-9 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {canAddUsers && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
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
                            maxConcurrentChats: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddUser}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      {isAdmin && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="filterSecretary">Secretaria</Label>
                <Select 
                  value={filterSecretaryId || ''}
                  onValueChange={(value) => handleSecretaryChange(value, true)}
                >
                  <SelectTrigger id="filterSecretary">
                    <SelectValue placeholder="Todas as secretarias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as secretarias</SelectItem>
                    {mockSecretaries.map(secretary => (
                      <SelectItem key={secretary.id} value={secretary.id}>
                        {secretary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filterSecretaryId && (
                <div>
                  <Label htmlFor="filterDepartment">Departamento</Label>
                  <Select 
                    value={filterDepartmentId || ''}
                    onValueChange={(value) => handleDepartmentChange(value, true)}
                  >
                    <SelectTrigger id="filterDepartment">
                      <SelectValue placeholder="Todos os departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os departamentos</SelectItem>
                      {mockDepartments
                        .filter(d => d.secretaryId === filterSecretaryId)
                        .map(department => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>
            Lista de todos os usuários registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead className="hidden md:table-cell">Secretaria</TableHead>
                  <TableHead className="hidden md:table-cell">Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadgeStyle(user.role)}
                        >
                          {getRoleName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.secretaryName || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.departmentName || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`h-2.5 w-2.5 rounded-full mr-2 ${
                              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          ></span>
                          <span>
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(user)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize os detalhes do usuário
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
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
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Função</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value: UserRole) =>
                    setCurrentUser({ ...currentUser, role: value })
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
                      setCurrentUser({
                        ...currentUser,
                        maxConcurrentChats: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação é irreversível.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
