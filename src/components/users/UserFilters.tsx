
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Secretary {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  secretaryId: string;
}

interface UserFiltersProps {
  isAdmin: boolean;
  mockSecretaries: Secretary[];
  mockDepartments: Department[];
  filterSecretaryId: string | null;
  filterDepartmentId: string | null;
  handleSecretaryChange: (value: string, isFilter: boolean) => void;
  handleDepartmentChange: (value: string, isFilter: boolean) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  isAdmin,
  mockSecretaries,
  mockDepartments,
  filterSecretaryId,
  filterDepartmentId,
  handleSecretaryChange,
  handleDepartmentChange,
}) => {
  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filterSecretary">Secretaria</Label>
            <Select 
              value={filterSecretaryId || 'all'}
              onValueChange={(value) => handleSecretaryChange(value === 'all' ? '' : value, true)}
            >
              <SelectTrigger id="filterSecretary">
                <SelectValue placeholder="Todas as secretarias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as secretarias</SelectItem>
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
                value={filterDepartmentId || 'all'}
                onValueChange={(value) => handleDepartmentChange(value === 'all' ? '' : value, true)}
              >
                <SelectTrigger id="filterDepartment">
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
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
  );
};

export default UserFilters;
