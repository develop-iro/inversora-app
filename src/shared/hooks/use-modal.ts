import { modal } from '@/core/overlay/modal';
import { useModalStore } from '@/core/overlay/modal-store';

/**
 * React hook for opening global sheet and alert modals.
 */
export function useModal() {
  const openSheet = useModalStore((state) => state.openSheet);
  const openAlert = useModalStore((state) => state.openAlert);
  const close = useModalStore((state) => state.close);
  const closeAll = useModalStore((state) => state.closeAll);

  return {
    openSheet,
    openAlert,
    close,
    closeAll,
    alert: modal.alert,
    confirm: modal.confirm,
  };
}
