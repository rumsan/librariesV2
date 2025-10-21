import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rumsan/shadcn';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '../button';

export interface AlertDialogProps
  extends VariantProps<typeof alertDialogVariants> {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  loading?: boolean;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  showCancel?: boolean; // Whether to show cancel button
}

const alertDialogVariants = cva('flex items-center gap-2', {
  variants: {
    variant: {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-orange-600 dark:text-orange-400',
      info: 'text-blue-600 dark:text-blue-400',
      default: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const alertDialogSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const alertDialogIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: AlertCircleIcon,
  info: InfoIcon,
  default: InfoIcon,
};

const actionButtonVariants = cva('', {
  variants: {
    variant: {
      success:
        'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700 text-white border-green-600 hover:border-green-700',
      error:
        'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 text-white border-red-600 hover:border-red-700',
      warning:
        'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 text-white border-orange-600 hover:border-orange-700',
      info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700',
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export function AlertDialogComponent({
  title,
  description,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  size = 'md',
  showIcon = true,
  loading = false,
  variant = 'default',
  children,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  showCancel,
  ...props
}: AlertDialogProps) {
  console.log('sss', variant);
  const [isConfirming, setIsConfirming] = React.useState(false);

  const IconComponent = alertDialogIcons[variant || 'default'];
  const iconStyles = alertDialogVariants({ variant });
  const buttonStyles = actionButtonVariants({ variant });
  const sizeStyles = alertDialogSizes[size];

  console.log('variant:', variant, 'buttonStyles:', buttonStyles);

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsConfirming(true);
      try {
        await onConfirm();
        onOpenChange?.(false);
      } catch (error) {
        console.error('Alert confirmation error:', error);
      } finally {
        setIsConfirming(false);
      }
    } else {
      onOpenChange?.(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange?.(false);
  };

  const isLoading = loading || isConfirming;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} {...props}>
      <AlertDialogContent
        className={cn(
          'w-full max-w-[calc(100vw-2rem)] mx-4 sm:mx-0  grid gap-4',
          sizeStyles,
          contentClassName,
        )}
        aria-describedby={description ? 'alert-dialog-description' : undefined}
      >
        <AlertDialogHeader className={cn('text-left', headerClassName)}>
          <AlertDialogTitle className={cn('flex items-start gap-3', className)}>
            {showIcon && (
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent
                  className={cn('h-5 w-5', iconStyles)}
                  aria-hidden="true"
                />
              </div>
            )}
            <span className="flex-1">{title}</span>
          </AlertDialogTitle>

          {description && (
            <AlertDialogDescription
              id="alert-dialog-description"
              className={cn(
                'text-sm text-muted-foreground mt-2',
                showIcon && 'ml-8',
              )}
            >
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {children && (
          <div className={cn('py-4', showIcon && 'ml-8')}>{children}</div>
        )}

        <AlertDialogFooter className={cn(footerClassName)}>
          {showCancel !== false && (
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              {cancelLabel}
            </AlertDialogCancel>
          )}

          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={variant || 'default'}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              confirmLabel
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

AlertDialogComponent.displayName = 'AlertDialogComponent';

// <AlertDialog open={open} onOpenChange={onOpenChange} {...props}>
//   <AlertDialogContent>
//     <AlertDialogHeader>
//       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//       <AlertDialogDescription>
//         This action cannot be undone. This will permanently delete your
//         account and remove your data from our servers.
//       </AlertDialogDescription>
//     </AlertDialogHeader>
//     <AlertDialogFooter>
//       <AlertDialogCancel>Cancel</AlertDialogCancel>
//       <AlertDialogAction className="bg-green-500 hover:bg-green-600">
//         Continue
//       </AlertDialogAction>
//     </AlertDialogFooter>
//   </AlertDialogContent>
// </AlertDialog>;
