
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/types/auth';
import { Edit, MoreVertical, Trash } from 'lucide-react';

interface UsersListProps {
  users: User[];
  openEditDialog: (user: User) => void;
  openDeleteDialog: (user: User) => void;
  getRoleName: (role: UserRole) => string;
  getRoleBadgeStyle: (role: UserRole) => string;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  openEditDialog,
  openDeleteDialog,
  getRoleName,
  getRoleBadgeStyle,
}) => {
  return (
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
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
  );
};

export default UsersList;
