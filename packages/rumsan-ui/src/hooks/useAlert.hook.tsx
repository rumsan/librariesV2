import { useCallback } from 'react';
import { useAlert as useAlertContext } from '../components/alert/alert-provider';
import type {
  AlertOptions,
  AlertType,
} from '../components/alert/alert-provider';

export interface UseAlertReturn {
  /**
   * Show an alert with custom configuration
   */
  show: (options: AlertOptions) => Promise<boolean>;

  /**
   * Show a success alert
   */
  success: (
    title: string,
    options?: Omit<AlertOptions, 'variant' | 'title'>,
  ) => Promise<boolean>;

  /**
   * Show an error alert
   */
  error: (
    title: string,
    options?: Omit<AlertOptions, 'variant' | 'title'>,
  ) => Promise<boolean>;

  /**
   * Show a warning alert
   */
  warning: (
    title: string,
    options?: Omit<AlertOptions, 'variant' | 'title'>,
  ) => Promise<boolean>;

  /**
   * Show an info alert
   */
  info: (
    title: string,
    options?: Omit<AlertOptions, 'variant' | 'title'>,
  ) => Promise<boolean>;

  /**
   * Show a confirmation dialog
   */
  confirm: (
    title: string,
    options?: Omit<AlertOptions, 'title'>,
  ) => Promise<boolean>;

  /**
   * Hide the current alert
   */
  hide: () => void;
}

/**
 * Hook for programmatically showing alerts and dialogs
 *
 * @example Basic usage
 * ```tsx
 * const alert = useAlert();
 *
 * // Show different types of alerts
 * await alert.success('Operation completed!');
 * await alert.error('Something went wrong');
 * await alert.warning('Please review your input');
 * await alert.info('New feature available');
 *
 * // Show confirmation dialog
 * const confirmed = await alert.confirm('Delete item?', {
 *   description: 'This action cannot be undone.',
 *   confirmLabel: 'Delete',
 *   variant: 'error'
 * });
 * ```
 *
 * @example Advanced configuration
 * ```tsx
 * const alert = useAlert();
 *
 * const result = await alert.show({
 *   title: 'Custom Alert',
 *   description: 'This is a custom alert with advanced options',
 *   variant: 'warning',
 *   size: 'lg',
 *   mode: 'dialog', // or 'toast' or 'fallback'
 *   confirmLabel: 'Proceed',
 *   cancelLabel: 'Go Back',
 *   onConfirm: async () => {
 *     // Custom confirmation logic
 *     console.log('User confirmed');
 *   },
 *   onCancel: () => {
 *     console.log('User cancelled');
 *   }
 * });
 * ```
 */
export function useAlert(): UseAlertReturn {
  const context = useAlertContext();

  const success = useCallback(
    (title: string, options: Omit<AlertOptions, 'variant' | 'title'> = {}) =>
      context.showSuccess({ ...options, title }),
    [context],
  );

  const error = useCallback(
    (title: string, options: Omit<AlertOptions, 'variant' | 'title'> = {}) =>
      context.showError({ ...options, title }),
    [context],
  );

  const warning = useCallback(
    (title: string, options: Omit<AlertOptions, 'variant' | 'title'> = {}) =>
      context.showWarning({ ...options, title }),
    [context],
  );

  const info = useCallback(
    (title: string, options: Omit<AlertOptions, 'variant' | 'title'> = {}) =>
      context.showInfo({ ...options, title }),
    [context],
  );

  const confirm = useCallback(
    (title: string, options: Omit<AlertOptions, 'title'> = {}) =>
      context.show({
        ...options,
        title,
        variant: options.variant || 'default',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
      }),
    [context],
  );

  return {
    show: context.show,
    success,
    error,
    warning,
    info,
    confirm,
    hide: context.hideAlert,
  };
}
