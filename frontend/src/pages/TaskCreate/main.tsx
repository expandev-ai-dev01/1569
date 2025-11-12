import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import type {
  TaskFormData,
  CreateTaskDto,
  TaskRecurrence,
  RecurrenceType,
} from '@/domain/task/types';
import type { TaskCreatePageProps } from './types';

export const TaskCreatePage = (props: TaskCreatePageProps) => {
  const navigate = useNavigate();
  const { createTask, isCreating } = useTaskCreate({
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const handleSubmit = async (data: TaskFormData) => {
    const createDto: CreateTaskDto = {
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedUsers: data.assignedUsers || [],
      recurrence: null,
    };

    if (
      data.hasRecurrence &&
      data.recurrenceType !== undefined &&
      data.interval &&
      data.startDate
    ) {
      const recurrence: TaskRecurrence = {
        recurrenceType: data.recurrenceType as RecurrenceType,
        interval: data.interval,
        startDate: new Date(data.startDate),
      };

      if (data.weekDays) {
        recurrence.weekDays = data.weekDays;
      }

      if (data.monthDay !== undefined) {
        recurrence.monthDay = data.monthDay;
      }

      if (data.endDate) {
        recurrence.endDate = new Date(data.endDate);
      }

      if (data.occurrenceCount) {
        recurrence.occurrenceCount = data.occurrenceCount;
      }

      createDto.recurrence = recurrence;
    }

    await createTask(createDto);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Criar Nova Tarefa</h2>
        <p className="text-gray-600 mt-1">Preencha os campos abaixo para criar uma nova tarefa</p>
      </div>
      <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
    </div>
  );
};

export default TaskCreatePage;
