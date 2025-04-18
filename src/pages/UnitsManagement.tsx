import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Plus, 
  Loader2, 
  ChevronRight, 
  AlertCircle, 
  RefreshCw, 
  Pencil, 
  Trash2,
  MessageSquarePlus
} from 'lucide-react';
import { 
  SecretaryWithDepartments, 
  Department,
  Service,
  QuestionAnswer,
  fetchSecretariesWithDepartments,
  deleteSecretary, 
  deleteDepartment, 
  deleteService
} from '@/services/units';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Component imports
import UnitsHeader from '@/components/units/UnitsHeader';
import UnitsLoadingError from '@/components/units/UnitsLoadingError';
import SecretaryActions from '@/components/units/SecretaryActions';
import DepartmentActions from '@/components/units/DepartmentActions';
import ServiceCard from '@/components/units/ServiceCard';
import AddSecretaryDialog from '@/components/units/AddSecretaryDialog';
import AddDepartmentDialog from '@/components/units/AddDepartmentDialog';
import AddServiceDialog from '@/components/units/AddServiceDialog';
import EditSecretaryDialog from '@/components/units/EditSecretaryDialog';
import EditDepartmentDialog from '@/components/units/EditDepartmentDialog';
import EditServiceDialog from '@/components/units/EditServiceDialog';
import DeleteConfirmationDialog from '@/components/units/DeleteConfirmationDialog';
import QuestionAnswersList from '@/components/units/QuestionAnswersList';

const UnitsManagement: React.FC = () => {
  const [secretariesData, setSecretariesData] = useState<SecretaryWithDepartments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Add dialogs
  const [isAddSecretaryOpen, setIsAddSecretaryOpen] = useState(false);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  
  // Edit dialogs
  const [isEditSecretaryOpen, setIsEditSecretaryOpen] = useState(false);
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  
  // Delete dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<'secretary' | 'department' | 'service'>('secretary');
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [deleteItemName, setDeleteItemName] = useState<string>('');
  
  // Selected items
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Selected items for edit
  const [selectedSecretaryForEdit, setSelectedSecretaryForEdit] = useState<{id: string, name: string} | null>(null);
  const [selectedDepartmentForEdit, setSelectedDepartmentForEdit] = useState<{id: string, name: string, secretary_id: string} | null>(null);
  const [selectedServiceForEdit, setSelectedServiceForEdit] = useState<{id: string, name: string, description: string | null} | null>(null);

  // Store expanded accordion items
  const [expandedSecretaries, setExpandedSecretaries] = useState<string[]>([]);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Fetch all secretaries with departments and services
  const loadData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchSecretariesWithDepartments();
      console.log("Loaded data:", data);
      setSecretariesData(data);
    } catch (error) {
      console.error('Error loading organizational structure:', error);
      toast.error('Erro ao carregar a estrutura organizacional');
      setLoadError('Erro ao carregar secretarias. Tente recarregar a página.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new department
  const handleAddDepartment = (secretaryId: string) => {
    console.log("Adding department to secretary:", secretaryId);
    setSelectedSecretaryId(secretaryId);
    setIsAddDepartmentOpen(true);
  };

  // Handle adding a new service
  const handleAddService = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    setIsAddServiceOpen(true);
  };

  // Handle editing a secretary
  const handleEditSecretary = (secretary: {id: string, name: string}) => {
    setSelectedSecretaryForEdit(secretary);
    setIsEditSecretaryOpen(true);
  };

  // Handle editing a department
  const handleEditDepartment = (department: {id: string, name: string, secretary_id: string}) => {
    setSelectedDepartmentForEdit(department);
    setIsEditDepartmentOpen(true);
  };

  // Handle editing a service
  const handleEditService = (service: {id: string, name: string, description: string | null}) => {
    setSelectedServiceForEdit(service);
    setIsEditServiceOpen(true);
  };

  // Handle deleting a secretary
  const handleDeleteSecretary = (secretaryId: string, secretaryName: string) => {
    setDeleteItemType('secretary');
    setDeleteItemId(secretaryId);
    setDeleteItemName(secretaryName);
    setIsDeleteConfirmOpen(true);
  };

  // Handle deleting a department
  const handleDeleteDepartment = (departmentId: string, departmentName: string) => {
    setDeleteItemType('department');
    setDeleteItemId(departmentId);
    setDeleteItemName(departmentName);
    setIsDeleteConfirmOpen(true);
  };

  // Handle deleting a service
  const handleDeleteService = (serviceId: string, serviceName: string) => {
    setDeleteItemType('service');
    setDeleteItemId(serviceId);
    setDeleteItemName(serviceName);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    try {
      let success = false;
      
      if (deleteItemType === 'secretary') {
        success = await deleteSecretary(deleteItemId);
      } else if (deleteItemType === 'department') {
        success = await deleteDepartment(deleteItemId);
      } else if (deleteItemType === 'service') {
        success = await deleteService(deleteItemId);
      }
      
      if (success) {
        loadData();
        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Erro ao excluir ${deleteItemType}`);
    }
  };

  const onSuccess = () => {
    loadData();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <UnitsHeader 
        loadError={loadError}
        onRefresh={loadData}
        onAddSecretary={() => setIsAddSecretaryOpen(true)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Estrutura Organizacional</CardTitle>
          <CardDescription>
            Hierarquia de secretarias, unidades e serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnitsLoadingError 
            isLoading={isLoading}
            loadError={loadError}
            onRefresh={loadData}
          />

          {!isLoading && !loadError && (
            <Accordion 
              type="multiple" 
              className="w-full"
              value={expandedSecretaries}
              onValueChange={setExpandedSecretaries}
            >
              {secretariesData.length > 0 ? (
                secretariesData.map((secretary) => (
                  <AccordionItem key={secretary.id} value={secretary.id}>
                    <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="font-medium">{secretary.name}</div>
                        <SecretaryActions 
                          secretary={secretary}
                          onEdit={handleEditSecretary}
                          onDelete={handleDeleteSecretary}
                          onAddDepartment={handleAddDepartment}
                        />
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent>
                      <div className="pl-6 border-l-2 border-gray-200 ml-4 mt-2">
                        {secretary.departments.length === 0 ? (
                          <p className="text-gray-500 py-2">Nenhuma unidade cadastrada</p>
                        ) : (
                          <Accordion 
                            type="multiple" 
                            className="w-full"
                            value={expandedDepartments}
                            onValueChange={setExpandedDepartments}
                          >
                            {secretary.departments.map((department) => (
                              <AccordionItem key={department.id} value={department.id}>
                                <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                                  <div className="flex items-center justify-between w-full pr-4">
                                    <div className="font-medium">{department.name}</div>
                                    <DepartmentActions
                                      department={department}
                                      onEdit={handleEditDepartment}
                                      onDelete={handleDeleteDepartment}
                                      onAddService={handleAddService}
                                    />
                                  </div>
                                </AccordionTrigger>
                                
                                <AccordionContent>
                                  <div className="pl-6 border-l-2 border-gray-200 ml-4 mt-2">
                                    {department.services.length === 0 ? (
                                      <p className="text-gray-500 py-2">Nenhum serviço cadastrado</p>
                                    ) : (
                                      <ul className="space-y-4">
                                        {department.services.map((service) => (
                                          <ServiceCard
                                            key={service.id}
                                            service={service}
                                            onEdit={handleEditService}
                                            onDelete={handleDeleteService}
                                            onSuccess={onSuccess}
                                          />
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
                ))
              ) : (
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

      {/* Edit Secretary Dialog */}
      <EditSecretaryDialog
        isOpen={isEditSecretaryOpen}
        setIsOpen={setIsEditSecretaryOpen}
        secretary={selectedSecretaryForEdit}
        onSuccess={onSuccess}
      />

      {/* Edit Department Dialog */}
      <EditDepartmentDialog
        isOpen={isEditDepartmentOpen}
        setIsOpen={setIsEditDepartmentOpen}
        department={selectedDepartmentForEdit}
        onSuccess={onSuccess}
      />

      {/* Edit Service Dialog */}
      <EditServiceDialog
        isOpen={isEditServiceOpen}
        setIsOpen={setIsEditServiceOpen}
        service={selectedServiceForEdit}
        onSuccess={onSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        itemType={deleteItemType}
        itemName={deleteItemName}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UnitsManagement;
