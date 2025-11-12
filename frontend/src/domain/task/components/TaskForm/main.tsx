import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskPriority, RecurrenceType } from '../../types';
import type { TaskFormProps } from './types';
import type { TaskFormData } from '../../types';
import {
  getTaskFormClassName,
  getFormFieldClassName,
  getLabelClassName,
  getInputClassName,
  getTextareaClassName,
  getSelectClassName,
  getErrorClassName,
  getButtonGroupClassName,
  getButtonClassName,
  getCheckboxClassName,
  getCheckboxLabelClassName,
} from './variants';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional(),
  assignedUsers: z
    .array(z.number())
    .max(5, 'Uma tarefa pode ter no máximo 5 responsáveis')
    .optional(),
  hasRecurrence: z.boolean(),
  recurrenceType: z.nativeEnum(RecurrenceType).optional(),
  interval: z.number().int().min(1).optional(),
  weekDays: z.string().optional(),
  monthDay: z.number().int().min(-1).max(31).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  occurrenceCount: z.number().int().min(1).max(100).optional(),
});

export const TaskForm = (props: TaskFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false, initialData } = props;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || TaskPriority.Medium,
      dueDate: initialData?.dueDate || '',
      assignedUsers: initialData?.assignedUsers || [],
      hasRecurrence: initialData?.hasRecurrence || false,
      recurrenceType: initialData?.recurrenceType,
      interval: initialData?.interval || 1,
      weekDays: initialData?.weekDays || '',
      monthDay: initialData?.monthDay,
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      occurrenceCount: initialData?.occurrenceCount,
    },
  });

  const hasRecurrence = watch('hasRecurrence');
  const recurrenceType = watch('recurrenceType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={getTaskFormClassName({})}>
      <div className={getFormFieldClassName()}>
        <label htmlFor="title" className={getLabelClassName()}>
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={getInputClassName(!!errors.title)}
          placeholder="Digite o título da tarefa"
          disabled={isSubmitting}
        />
        {errors.title && <p className={getErrorClassName()}>{errors.title.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label htmlFor="description" className={getLabelClassName()}>
          Descrição
        </label>
        <textarea
          id="description"
          {...register('description')}
          className={getTextareaClassName(!!errors.description)}
          placeholder="Digite a descrição da tarefa"
          rows={4}
          disabled={isSubmitting}
        />
        {errors.description && <p className={getErrorClassName()}>{errors.description.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label htmlFor="priority" className={getLabelClassName()}>
          Prioridade <span className="text-red-500">*</span>
        </label>
        <select
          id="priority"
          {...register('priority', { valueAsNumber: true })}
          className={getSelectClassName(!!errors.priority)}
          disabled={isSubmitting}
        >
          <option value={TaskPriority.Low}>Baixa</option>
          <option value={TaskPriority.Medium}>Média</option>
          <option value={TaskPriority.High}>Alta</option>
        </select>
        {errors.priority && <p className={getErrorClassName()}>{errors.priority.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label htmlFor="dueDate" className={getLabelClassName()}>
          Data de Vencimento
        </label>
        <input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          className={getInputClassName(!!errors.dueDate)}
          disabled={isSubmitting}
        />
        {errors.dueDate && <p className={getErrorClassName()}>{errors.dueDate.message}</p>}
      </div>

      <div className={getFormFieldClassName()}>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('hasRecurrence')}
            className={getCheckboxClassName()}
            disabled={isSubmitting}
          />
          <span className={getCheckboxLabelClassName()}>Configurar recorrência</span>
        </label>
      </div>

      {hasRecurrence && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuração de Recorrência</h3>

          <div className={getFormFieldClassName()}>
            <label htmlFor="recurrenceType" className={getLabelClassName()}>
              Tipo de Recorrência <span className="text-red-500">*</span>
            </label>
            <select
              id="recurrenceType"
              {...register('recurrenceType', { valueAsNumber: true })}
              className={getSelectClassName(!!errors.recurrenceType)}
              disabled={isSubmitting}
            >
              <option value="">Selecione</option>
              <option value={RecurrenceType.Daily}>Diária</option>
              <option value={RecurrenceType.Weekly}>Semanal</option>
              <option value={RecurrenceType.Monthly}>Mensal</option>
              <option value={RecurrenceType.Yearly}>Anual</option>
            </select>
            {errors.recurrenceType && (
              <p className={getErrorClassName()}>{errors.recurrenceType.message}</p>
            )}
          </div>

          <div className={getFormFieldClassName()}>
            <label htmlFor="interval" className={getLabelClassName()}>
              Intervalo <span className="text-red-500">*</span>
            </label>
            <input
              id="interval"
              type="number"
              {...register('interval', { valueAsNumber: true })}
              className={getInputClassName(!!errors.interval)}
              min="1"
              disabled={isSubmitting}
            />
            {errors.interval && <p className={getErrorClassName()}>{errors.interval.message}</p>}
          </div>

          {recurrenceType === RecurrenceType.Weekly && (
            <div className={getFormFieldClassName()}>
              <label htmlFor="weekDays" className={getLabelClassName()}>
                Dias da Semana (0-6, separados por vírgula)
              </label>
              <input
                id="weekDays"
                type="text"
                {...register('weekDays')}
                className={getInputClassName(!!errors.weekDays)}
                placeholder="Ex: 0,1,2,3,4"
                disabled={isSubmitting}
              />
              {errors.weekDays && <p className={getErrorClassName()}>{errors.weekDays.message}</p>}
            </div>
          )}

          {recurrenceType === RecurrenceType.Monthly && (
            <div className={getFormFieldClassName()}>
              <label htmlFor="monthDay" className={getLabelClassName()}>
                Dia do Mês (1-31 ou -1 para último dia)
              </label>
              <input
                id="monthDay"
                type="number"
                {...register('monthDay', { valueAsNumber: true })}
                className={getInputClassName(!!errors.monthDay)}
                min="-1"
                max="31"
                disabled={isSubmitting}
              />
              {errors.monthDay && <p className={getErrorClassName()}>{errors.monthDay.message}</p>}
            </div>
          )}

          <div className={getFormFieldClassName()}>
            <label htmlFor="startDate" className={getLabelClassName()}>
              Data de Início <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className={getInputClassName(!!errors.startDate)}
              disabled={isSubmitting}
            />
            {errors.startDate && <p className={getErrorClassName()}>{errors.startDate.message}</p>}
          </div>

          <div className={getFormFieldClassName()}>
            <label htmlFor="endDate" className={getLabelClassName()}>
              Data de Término
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className={getInputClassName(!!errors.endDate)}
              disabled={isSubmitting}
            />
            {errors.endDate && <p className={getErrorClassName()}>{errors.endDate.message}</p>}
          </div>

          <div className={getFormFieldClassName()}>
            <label htmlFor="occurrenceCount" className={getLabelClassName()}>
              Número de Ocorrências
            </label>
            <input
              id="occurrenceCount"
              type="number"
              {...register('occurrenceCount', { valueAsNumber: true })}
              className={getInputClassName(!!errors.occurrenceCount)}
              min="1"
              max="100"
              disabled={isSubmitting}
            />
            {errors.occurrenceCount && (
              <p className={getErrorClassName()}>{errors.occurrenceCount.message}</p>
            )}
          </div>
        </div>
      )}

      <div className={getButtonGroupClassName()}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={getButtonClassName('secondary')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        )}
        <button type="submit" className={getButtonClassName('primary')} disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};
