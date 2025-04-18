
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, UserCheck } from 'lucide-react';
import { QuestionAnswer } from '@/services/units/types';
import QuestionAnswersList from './QuestionAnswersList';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string | null;
    questionsAnswers: QuestionAnswer[];
  };
  onEdit: (service: { id: string; name: string; description: string | null }) => void;
  onDelete: (id: string, name: string) => void;
  onSuccess: () => void;
  onlineAttendants?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  onSuccess,
  onlineAttendants = 0
}) => {
  return (
    <li className="p-3 bg-gray-50 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h4 className="font-medium">{service.name}</h4>
          {onlineAttendants > 0 && (
            <div className="ml-2 text-xs flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full">
              <UserCheck className="h-3 w-3 mr-1" />
              {onlineAttendants}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit({
              id: service.id,
              name: service.name,
              description: service.description
            })}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(service.id, service.name)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {service.description && (
        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
      )}
      
      <QuestionAnswersList 
        serviceId={service.id} 
        initialQuestions={service.questionsAnswers}
        onSuccess={onSuccess}
      />
    </li>
  );
};

export default ServiceCard;
