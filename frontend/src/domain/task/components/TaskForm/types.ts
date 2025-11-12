import type { TaskFormData } from '../../types';

export interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<TaskFormData>;
}
