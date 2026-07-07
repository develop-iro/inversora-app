import type { ToastInput, ToastVariant } from '@/core/overlay/overlay.types';
import { useToastStore } from '@/core/overlay/toast-store';

type ToastShortcutOptions = Omit<ToastInput, 'message' | 'variant'>;

function showToast(message: string, variant: ToastVariant, options?: ToastShortcutOptions): string {
  return useToastStore.getState().show({
    message,
    variant,
    ...options,
  });
}

/**
 * Imperative toast API. Safe to call outside React components.
 */
export const toast = {
  show: (input: ToastInput): string => useToastStore.getState().show(input),

  success: (message: string, options?: ToastShortcutOptions): string =>
    showToast(message, 'success', options),

  error: (message: string, options?: ToastShortcutOptions): string =>
    showToast(message, 'error', options),

  info: (message: string, options?: ToastShortcutOptions): string =>
    showToast(message, 'info', options),

  warning: (message: string, options?: ToastShortcutOptions): string =>
    showToast(message, 'warning', options),

  dismiss: (id: string): void => {
    useToastStore.getState().dismiss(id);
  },

  clear: (): void => {
    useToastStore.getState().clear();
  },
};
