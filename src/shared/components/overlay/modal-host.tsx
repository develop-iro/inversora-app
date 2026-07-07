import { useCallback } from 'react';

import { useModalStore } from '@/core/overlay/modal-store';
import { AppAlertDialog } from '@/shared/components/overlay/app-alert-dialog';
import { AppModalShell } from '@/shared/components/overlay/app-modal-shell';

/**
 * Root modal renderer. Mount once in `AppProviders`.
 */
export function ModalHost() {
  const stack = useModalStore((state) => state.stack);
  const close = useModalStore((state) => state.close);
  const activeEntry = stack[stack.length - 1];

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  if (activeEntry === undefined) {
    return null;
  }

  if (activeEntry.kind === 'alert') {
    return <AppAlertDialog entry={activeEntry} onClose={handleClose} />;
  }

  return (
    <AppModalShell
      visible
      title={activeEntry.title}
      subtitle={activeEntry.subtitle}
      body={activeEntry.content}
      footer={activeEntry.footer}
      onClose={handleClose}
    />
  );
}
