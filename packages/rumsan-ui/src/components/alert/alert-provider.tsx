import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AlertDialogComponent, type AlertDialogProps } from './alert-dialog';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'default';

export type AlertMode = 'dialog' | 'toast' | 'fallback';

export interface AlertConfig {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: AlertType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  loading?: boolean;
  mode?: AlertMode;
  duration?: number; // For toast mode
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  showCancel?: boolean; // Whether to show cancel button
}

export interface AlertOptions extends AlertConfig {
  mode?: AlertMode;
}

interface AlertContextType {
  show: (options: AlertOptions) => Promise<boolean>;
  showSuccess: (options: Omit<AlertOptions, 'variant'>) => Promise<boolean>;
  showError: (options: Omit<AlertOptions, 'variant'>) => Promise<boolean>;
  showWarning: (options: Omit<AlertOptions, 'variant'>) => Promise<boolean>;
  showInfo: (options: Omit<AlertOptions, 'variant'>) => Promise<boolean>;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export interface AlertProviderProps {
  children: React.ReactNode;
  defaultMode?: AlertMode;
}

export function AlertProvider({
  children,
  defaultMode = 'dialog',
}: AlertProviderProps) {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    config: AlertConfig;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    config: {},
  });

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const show = useCallback(
    async (options: AlertOptions): Promise<boolean> => {
      const mode = options.mode || defaultMode;

      // Fallback to native alert
      if (mode === 'fallback') {
        const message = `${options.title || 'Alert'}${options.description ? `\n\n${options.description}` : ''}`;
        const result = window.confirm(message);
        if (result && options.onConfirm) {
          await options.onConfirm();
        } else if (!result && options.onCancel) {
          options.onCancel();
        }
        return result;
      }

      // Toast mode
      if (mode === 'toast') {
        const toastOptions = {
          description: options.description,
          duration: options.duration || 4000,
          action: options.onConfirm
            ? {
                label: options.confirmLabel || 'Confirm',
                onClick: () => {
                  options.onConfirm?.();
                },
              }
            : undefined,
          cancel: options.onCancel
            ? {
                label: options.cancelLabel || 'Cancel',
                onClick: () => {
                  options.onCancel?.();
                },
              }
            : undefined,
        };

        switch (options.variant) {
          case 'success':
            toast.success(options.title || 'Success', toastOptions);
            break;
          case 'error':
            toast.error(options.title || 'Error', toastOptions);
            break;
          case 'warning':
            toast.warning(options.title || 'Warning', toastOptions);
            break;
          case 'info':
            toast.info(options.title || 'Info', toastOptions);
            break;
          default:
            toast(options.title || 'Alert', toastOptions);
        }

        return true; // Toast doesn't block, so return true
      }

      // Dialog mode (default)
      return new Promise<boolean>((resolve) => {
        setAlertState({
          isOpen: true,
          config: options,
          resolve,
        });
      });
    },
    [defaultMode],
  );

  const showSuccess = useCallback(
    (options: Omit<AlertOptions, 'variant'>) =>
      show({
        ...options,
        variant: 'success',
        showCancel: options.showCancel ?? false, // Default to no cancel for success
        confirmLabel: options.confirmLabel || 'OK',
      }),
    [show],
  );

  const showError = useCallback(
    (options: Omit<AlertOptions, 'variant'>) =>
      show({
        ...options,
        variant: 'error',
        showCancel: options.showCancel ?? false, // Default to no cancel for error
        confirmLabel: options.confirmLabel || 'OK',
      }),
    [show],
  );

  const showWarning = useCallback(
    (options: Omit<AlertOptions, 'variant'>) =>
      show({
        ...options,
        variant: 'warning',
        showCancel: options.showCancel ?? false, // Default to no cancel for warning
        confirmLabel: options.confirmLabel || 'OK',
      }),
    [show],
  );

  const showInfo = useCallback(
    (options: Omit<AlertOptions, 'variant'>) =>
      show({
        ...options,
        variant: 'info',
        showCancel: options.showCancel ?? false, // Default to no cancel for info
        confirmLabel: options.confirmLabel || 'OK',
      }),
    [show],
  );

  const handleConfirm = useCallback(async () => {
    try {
      if (alertState.config.onConfirm) {
        await alertState.config.onConfirm();
      }
      alertState.resolve?.(true);
    } catch (error) {
      console.error('Alert confirmation error:', error);
      // Still resolve as true but let the error bubble up
      alertState.resolve?.(true);
    } finally {
      hideAlert();
    }
  }, [alertState.config.onConfirm, alertState.resolve, hideAlert]);

  const handleCancel = useCallback(() => {
    if (alertState.config.onCancel) {
      alertState.config.onCancel();
    }
    alertState.resolve?.(false);
    hideAlert();
  }, [alertState.config.onCancel, alertState.resolve, hideAlert]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        alertState.resolve?.(false);
        hideAlert();
      }
    },
    [alertState.resolve, hideAlert],
  );

  const contextValue: AlertContextType = {
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      <AlertDialogComponent
        {...alertState.config}
        open={alertState.isOpen}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
