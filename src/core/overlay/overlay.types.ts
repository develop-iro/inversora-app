import type { ReactNode } from 'react';

/** Visual tone for transient toast feedback. */
export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

/** A single toast queued for display. */
export type ToastEntry = {
  readonly id: string;
  readonly message: string;
  readonly title?: string;
  readonly variant: ToastVariant;
  readonly durationMs: number;
};

/** Input accepted by the toast store before an id is assigned. */
export type ToastInput = {
  readonly id?: string;
  readonly message: string;
  readonly title?: string;
  readonly variant?: ToastVariant;
  readonly durationMs?: number;
};

/** Action button for alert-style modals. */
export type ModalButton = {
  readonly label: string;
  readonly variant?: 'primary' | 'secondary' | 'danger';
  readonly onPress?: () => void;
};

/** Sheet modal with arbitrary React content. */
export type ModalSheetEntry = {
  readonly id: string;
  readonly kind: 'sheet';
  readonly title: string;
  readonly subtitle?: string;
  readonly content: ReactNode;
  readonly footer?: ReactNode;
  readonly onClose?: () => void;
};

/** Centered alert dialog with optional action buttons. */
export type ModalAlertEntry = {
  readonly id: string;
  readonly kind: 'alert';
  readonly title: string;
  readonly message: string;
  readonly buttons?: readonly ModalButton[];
  readonly onClose?: () => void;
};

/** Discriminated modal entry rendered by the global host. */
export type ModalEntry = ModalSheetEntry | ModalAlertEntry;

/** Input for opening a sheet modal. */
export type ModalSheetInput = {
  readonly id?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly content: ReactNode;
  readonly footer?: ReactNode;
  readonly onClose?: () => void;
};

/** Input for opening an alert dialog. */
export type ModalAlertInput = {
  readonly id?: string;
  readonly title: string;
  readonly message: string;
  readonly buttons?: readonly ModalButton[];
  readonly onClose?: () => void;
};
