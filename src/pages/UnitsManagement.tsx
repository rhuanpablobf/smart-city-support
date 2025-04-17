
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SecretaryWithDepartments, fetchSecretariesWithDepartments } from '@/services/unitsService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import AddSecretaryDialog from '@/components/units/AddSecretaryDialog';
import AddDepartmentDialog from '@/components/units/AddDepartmentDialog';
import AddServiceDialog from '@/components/units/AddServiceDialog';

const UnitsManagement: React.FC = () => {
  const [secretariesData, setSecretariesData] = useState<SecretaryWithDepartments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSecretaryOpen, setIsAddSecretaryOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Fetch all secretaries with departments and services
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSecretariesWithDepartments();
      setSecretariesData(data);
    } catch (error) {
      console.error('Error loading organizational structure:', error);
      toast.error('Erro ao carregar a estrutura organizacional');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = (secretaryId: string) => {
    setSelectedSecretaryId(secretaryId);
    setIsAddDepartmentOpen(true);
  };

  const handleAddService = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsAddServiceOpen(true);
  };

  const onSuccess = () => {
    loadData();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestão de Unidades e Serviços</h1>
          <p className="text-gray-500">
            Gerencie secretarias, unidades e serviços no sistema
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button onClick={() => setIsAddSecretaryOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Secretaria
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estrutura Organizacional</CardTitle>
          <CardDescription>
            Hierarquia de secretarias, unidades e serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando estrutura organizacional...</span>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {secretariesData.map((secretary) => (
                <AccordionItem key={secretary.id} value={secretary.id}>
                  <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="font-medium">{secretary.name}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddDepartment(secretary.id);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Unidade
                      </Button>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent>
                    <div className="pl-6 border-l-2 border-gray-200 ml-4 mt-2">
                      {secretary.departments.length === 0 ? (
                        <p className="text-gray-500 py-2">Nenhuma unidade cadastrada</p>
                      ) : (
                        <Accordion type="multiple" className="w-full">
                          {secretary.departments.map((department) => (
                            <AccordionItem key={department.id} value={department.id}>
                              <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <div className="font-medium">{department.name}</div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddService(department.id);
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Adicionar Serviço
                                  </Button>
                                </div>
                              </AccordionTrigger>
                              
                              <AccordionContent>
                                <div className="pl-6 border-l-2 border-gray-200 ml-4 mt-2">
                                  {department.services.length === 0 ? (
                                    <p className="text-gray-500 py-2">Nenhum serviço cadastrado</p>
                                  ) : (
                                    <ul className="space-y-2">
                                      {department.services.map((service) => (
                                        <li key={service.id} className="p-2 hover:bg-gray-50 rounded-md flex items-center justify-between">
                                          <span>{service.name}</span>
                                          <Button variant="ghost" size="sm">
                                            <ChevronRight className="h-4 w-4" />
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {secretariesData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma secretaria cadastrada. Clique em "Nova Secretaria" para começar.
                </div>
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Add Secretary Dialog */}
      <AddSecretaryDialog 
        isOpen={isAddSecretaryOpen}
        setIsOpen={setIsAddSecretaryOpen}
        onSuccess={onSuccess}
      />

      {/* Add Department Dialog */}
      <AddDepartmentDialog 
        isOpen={isAddDepartmentOpen}
        setIsOpen={setIsAddDepartmentOpen}
        secretaryId={selectedSecretaryId}
        onSuccess={onSuccess}
      />

      {/* Add Service Dialog */}
      <AddServiceDialog 
        isOpen={isAddServiceOpen}
        setIsOpen={setIsAddServiceOpen}
        departmentId={selectedDepartmentId}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default UnitsManagement;
