import { create } from 'zustand';

import { createOverlayId } from '@/core/overlay/create-overlay-id';
import type { ToastEntry, ToastInput } from '@/core/overlay/overlay.types';

const DEFAULT_TOAST_DURATION_MS = 3200;
const MAX_VISIBLE_TOASTS = 3;

type ToastState = {
  readonly toasts: readonly ToastEntry[];
  show: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

/**
 * Global toast queue. Mount `ToastHost` once at the app root.
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show: (input) => {
    const id = input.id ?? createOverlayId('toast');
    const entry: ToastEntry = {
      id,
      message: input.message,
      title: input.title,
      variant: input.variant ?? 'info',
      durationMs: input.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    };

    set((state) => ({
      toasts: [...state.toasts, entry].slice(-MAX_VISIBLE_TOASTS),
    }));

    return id;
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clear: () => {
    set({ toasts: [] });
  },
}));
