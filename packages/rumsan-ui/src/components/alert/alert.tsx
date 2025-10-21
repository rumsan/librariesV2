import React from 'react';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from 'lucide-react';
import { cn } from '@rumsan/shadcn/lib/utils';

export interface BaseAlertProps {
  title?: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  closeable?: boolean;
}

const alertVariants = {
  success: {
    container:
      'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-100',
    icon: 'text-green-600 dark:text-green-400',
    IconComponent: CheckCircleIcon,
  },
  error: {
    container:
      'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-100',
    icon: 'text-red-600 dark:text-red-400',
    IconComponent: XCircleIcon,
  },
  warning: {
    container:
      'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-100',
    icon: 'text-orange-600 dark:text-orange-400',
    IconComponent: AlertCircleIcon,
  },
  info: {
    container:
      'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-100',
    icon: 'text-blue-600 dark:text-blue-400',
    IconComponent: InfoIcon,
  },
  default: {
    container: 'border-border bg-background text-foreground',
    icon: 'text-muted-foreground',
    IconComponent: InfoIcon,
  },
};

const alertSizes = {
  sm: 'p-3 text-sm',
  md: 'p-4 text-base',
  lg: 'p-6 text-lg',
};

export function Alert({
  title,
  description,
  variant = 'default',
  size = 'md',
  onClose,
  className,
  children,
  showIcon = true,
  closeable = true,
  ...props
}: BaseAlertProps & React.HTMLAttributes<HTMLDivElement>) {
  const variantStyles = alertVariants[variant];
  const sizeStyles = alertSizes[size];
  const IconComponent = variantStyles.IconComponent;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'relative w-full rounded-lg border animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
        variantStyles.container,
        sizeStyles,
        className,
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex-shrink-0">
            <IconComponent
              className={cn('h-5 w-5', variantStyles.icon)}
              aria-hidden="true"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {title && <h3 className="font-medium leading-tight mb-1">{title}</h3>}

          {description && (
            <p className="text-sm opacity-90 leading-relaxed">{description}</p>
          )}

          {children}
        </div>

        {closeable && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex-shrink-0 rounded-md p-1.5 inline-flex items-center justify-center transition-colors',
              'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
              'dark:hover:bg-white/5',
              variantStyles.icon,
            )}
            aria-label="Dismiss alert"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

Alert.displayName = 'Alert';
