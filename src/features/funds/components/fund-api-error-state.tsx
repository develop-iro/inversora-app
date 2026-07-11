import type { ReactNode } from 'react';

import { ReloadState, type ReloadStateLayout } from '@/shared/components/ui/reload-state';
import type { StatusIconVariant } from '@/shared/components/ui/status-icon-tokens';
import { cn } from '@/shared/utils/cn';

export type FundApiErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: StatusIconVariant;
  layout?: ReloadStateLayout;
  children?: ReactNode;
  className?: string;
};

/**
 * Funds-domain wrapper around the shared reload state.
 */
export function FundApiErrorState({
  title,
  message,
  onRetry,
  retryLabel = 'Reintentar',
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'error',
  layout = 'screen',
  children,
  className,
}: FundApiErrorStateProps) {
  return (
    <ReloadState
      title={title}
      message={message}
      actionLabel={retryLabel}
      onAction={onRetry}
      secondaryActionLabel={secondaryActionLabel}
      onSecondaryAction={onSecondaryAction}
      variant={variant}
      layout={layout}
      className={cn(className)}
    >
      {children}
    </ReloadState>
  );
}
