import { create } from 'zustand';

import { createOverlayId } from '@/core/overlay/create-overlay-id';
import type {
  ModalAlertEntry,
  ModalAlertInput,
  ModalEntry,
  ModalSheetEntry,
  ModalSheetInput,
} from '@/core/overlay/overlay.types';

type ModalState = {
  readonly stack: readonly ModalEntry[];
  openSheet: (input: ModalSheetInput) => string;
  openAlert: (input: ModalAlertInput) => string;
  close: (id?: string) => void;
  closeAll: () => void;
};

function removeFromStack(stack: readonly ModalEntry[], id?: string): readonly ModalEntry[] {
  if (id === undefined) {
    return stack.slice(0, -1);
  }

  return stack.filter((entry) => entry.id !== id);
}

/**
 * Global modal stack. Mount `ModalHost` once at the app root.
 */
export const useModalStore = create<ModalState>((set, get) => ({
  stack: [],

  openSheet: (input) => {
    const id = input.id ?? createOverlayId('modal-sheet');
    const entry: ModalSheetEntry = {
      id,
      kind: 'sheet',
      title: input.title,
      subtitle: input.subtitle,
      content: input.content,
      footer: input.footer,
      onClose: input.onClose,
    };

    set((state) => ({
      stack: [...state.stack, entry],
    }));

    return id;
  },

  openAlert: (input) => {
    const id = input.id ?? createOverlayId('modal-alert');
    const entry: ModalAlertEntry = {
      id,
      kind: 'alert',
      title: input.title,
      message: input.message,
      buttons: input.buttons,
      backdrop: input.backdrop,
      onClose: input.onClose,
    };

    set((state) => ({
      stack: [...state.stack, entry],
    }));

    return id;
  },

  close: (id) => {
    const current = get().stack;
    const next = removeFromStack(current, id);
    const removed = current.length !== next.length ? current[current.length - 1] : undefined;

    if (id !== undefined) {
      const target = current.find((entry) => entry.id === id);
      target?.onClose?.();
    } else if (removed !== undefined) {
      removed.onClose?.();
    }

    set({ stack: next });
  },

  closeAll: () => {
    set({ stack: [] });
  },
}));
