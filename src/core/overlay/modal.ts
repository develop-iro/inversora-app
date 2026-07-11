import type {
  ModalAlertInput,
  ModalButton,
  ModalConfirmOptions,
  ModalSheetInput,
} from '@/core/overlay/overlay.types';
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
      backdrop: 'blur-scrim',
      buttons:
        buttons ??
        [
          {
            label: 'Entendido',
            variant: 'primary',
          },
        ],
    }),

  /**
   * Confirmation dialog that resolves to `true` when the user confirms.
   */
  confirm: (title: string, message: string, options?: ModalConfirmOptions): Promise<boolean> =>
    new Promise((resolve) => {
      let settled = false;

      const settle = (value: boolean): void => {
        if (settled) {
          return;
        }

        settled = true;
        resolve(value);
      };

      useModalStore.getState().openAlert({
        title,
        message,
        backdrop: options?.backdrop ?? 'blur-scrim',
        buttons: [
          {
            label: options?.cancelLabel ?? 'Cancelar',
            variant: 'secondary',
            onPress: () => {
              settle(false);
            },
          },
          {
            label: options?.confirmLabel ?? 'Confirmar',
            variant: options?.destructive ? 'danger' : 'primary',
            onPress: () => {
              settle(true);
            },
          },
        ],
        onClose: () => {
          settle(false);
        },
      });
    }),

  close: (id?: string): void => {
    useModalStore.getState().close(id);
  },

  closeAll: (): void => {
    useModalStore.getState().closeAll();
  },
};
