import { clsx } from 'clsx';

export interface TaskFormVariantProps {
  className?: string;
}

export function getTaskFormClassName(props: TaskFormVariantProps): string {
  const { className } = props;

  return clsx('bg-white rounded-lg shadow p-6', className);
}

export function getFormFieldClassName(): string {
  return clsx('mb-4');
}

export function getLabelClassName(): string {
  return clsx('block text-sm font-medium text-gray-700 mb-1');
}

export function getInputClassName(hasError: boolean = false): string {
  return clsx(
    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
    {
      'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !hasError,
      'border-red-500 focus:ring-red-500 focus:border-red-500': hasError,
    }
  );
}

export function getTextareaClassName(hasError: boolean = false): string {
  return clsx(
    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors resize-vertical',
    {
      'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !hasError,
      'border-red-500 focus:ring-red-500 focus:border-red-500': hasError,
    }
  );
}

export function getSelectClassName(hasError: boolean = false): string {
  return clsx(
    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
    {
      'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !hasError,
      'border-red-500 focus:ring-red-500 focus:border-red-500': hasError,
    }
  );
}

export function getErrorClassName(): string {
  return clsx('text-sm text-red-600 mt-1');
}

export function getButtonGroupClassName(): string {
  return clsx('flex gap-4 justify-end mt-6');
}

export function getButtonClassName(variant: 'primary' | 'secondary' = 'primary'): string {
  return clsx(
    'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
    }
  );
}

export function getCheckboxClassName(): string {
  return clsx('h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded');
}

export function getCheckboxLabelClassName(): string {
  return clsx('ml-2 text-sm text-gray-700');
}
