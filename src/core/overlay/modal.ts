import type { ModalAlertInput, ModalButton, ModalSheetInput } from '@/core/overlay/overlay.types';
import { useModalStore } from '@/core/overlay/modal-store';

/**
 * Imperative modal API. Safe to call outside React components.
 */
export const modal = {
  openSheet: (input: ModalSheetInput): string => useModalStore.getState().openSheet(input),

  openAlert: (input: ModalAlertInput): string => useModalStore.getState().openAlert(input),

  /**
   * Drop-in replacement for simple `Alert.alert(title, message)` calls.
   */
  alert: (title: string, message: string, buttons?: readonly ModalButton[]): string =>
    useModalStore.getState().openAlert({
      title,
      message,
      buttons:
        buttons ??
        [
          {
            label: 'Entendido',
            variant: 'primary',
          },
        ],
    }),

  close: (id?: string): void => {
    useModalStore.getState().close(id);
  },

  closeAll: (): void => {
    useModalStore.getState().closeAll();
  },
};
