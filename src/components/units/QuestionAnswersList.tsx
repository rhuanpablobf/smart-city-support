import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Plus, 
  MessageSquare, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { 
  QuestionAnswer,
  addQuestionAnswer, 
  updateQuestionAnswer, 
  deleteQuestionAnswer 
} from '@/services/units';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface QuestionAnswersListProps {
  serviceId: string;
  initialQuestions: QuestionAnswer[];
  onSuccess: () => void;
}

const QuestionAnswersList: React.FC<QuestionAnswersListProps> = ({
  serviceId,
  initialQuestions,
  onSuccess
}) => {
  const [questions, setQuestions] = useState<QuestionAnswer[]>(initialQuestions || []);
  
  // Add question state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Edit question state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editAnswerText, setEditAnswerText] = useState('');
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);

  // Delete question state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [deleteQuestionText, setDeleteQuestionText] = useState('');
  
  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      return;
    }

    setIsAddingQuestion(true);
    try {
      const result = await addQuestionAnswer(serviceId, newQuestion, newAnswer);
      if (result) {
        setNewQuestion('');
        setNewAnswer('');
        setIsAddDialogOpen(false);
        onSuccess();
      }
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const handleEditQuestion = async () => {
    if (!editQuestionText.trim() || !editAnswerText.trim() || !editQuestionId) {
      return;
    }

    setIsEditingQuestion(true);
    try {
      const result = await updateQuestionAnswer(
        editQuestionId,
        editQuestionText,
        editAnswerText
      );
      
      if (result) {
        setEditQuestionId(null);
        setEditQuestionText('');
        setEditAnswerText('');
        setIsEditDialogOpen(false);
        onSuccess();
      }
    } finally {
      setIsEditingQuestion(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteQuestionId) return;

    try {
      const success = await deleteQuestionAnswer(deleteQuestionId);
      if (success) {
        setDeleteQuestionId(null);
        setDeleteQuestionText('');
        setIsDeleteDialogOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const openEditDialog = (question: QuestionAnswer) => {
    setEditQuestionId(question.id);
    setEditQuestionText(question.question);
    setEditAnswerText(question.answer);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (question: QuestionAnswer) => {
    setDeleteQuestionId(question.id);
    setDeleteQuestionText(question.question);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-medium flex items-center">
          <MessageSquare className="h-4 w-4 mr-1" /> 
          Perguntas e Respostas
        </h5>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-3 w-3 mr-1" /> 
          Nova Pergunta
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-sm text-gray-500 italic py-2">
          Nenhuma pergunta e resposta cadastrada para este serviço.
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((qa) => (
            <Card key={qa.id} className="shadow-sm">
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-semibold">{qa.question}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => openEditDialog(qa)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                      onClick={() => openDeleteDialog(qa)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-sm">{qa.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!isAddingQuestion) {
          setIsAddDialogOpen(open);
          if (!open) {
            setNewQuestion('');
            setNewAnswer('');
          }
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Nova Pergunta e Resposta</DialogTitle>
            <DialogDescription>
              Adicione uma nova pergunta e resposta para este serviço
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Pergunta</Label>
              <Input
                id="question"
                placeholder="Digite a pergunta"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="answer">Resposta</Label>
              <Textarea
                id="answer"
                placeholder="Digite a resposta"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isAddingQuestion}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddQuestion}
              disabled={isAddingQuestion || !newQuestion.trim() || !newAnswer.trim()}
            >
              {isAddingQuestion ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!isEditingQuestion) {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditQuestionId(null);
            setEditQuestionText('');
            setEditAnswerText('');
          }
        }
      }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Pergunta e Resposta</DialogTitle>
            <DialogDescription>
              Atualize a pergunta e resposta selecionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-question">Pergunta</Label>
              <Input
                id="edit-question"
                placeholder="Digite a pergunta"
                value={editQuestionText}
                onChange={(e) => setEditQuestionText(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-answer">Resposta</Label>
              <Textarea
                id="edit-answer"
                placeholder="Digite a resposta"
                value={editAnswerText}
                onChange={(e) => setEditAnswerText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isEditingQuestion}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditQuestion}
              disabled={isEditingQuestion || !editQuestionText.trim() || !editAnswerText.trim()}
            >
              {isEditingQuestion ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Question Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        itemType="question"
        itemName={deleteQuestionText}
        onConfirm={handleDeleteQuestion}
      />
    </div>
  );
};

export default QuestionAnswersList;
