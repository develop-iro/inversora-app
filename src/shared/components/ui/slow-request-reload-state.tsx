import {
  SLOW_REQUEST_NOTICE_MESSAGE,
  SLOW_REQUEST_NOTICE_TITLE,
} from '@/shared/constants/slow-request-notice';
import {
  ReloadState,
  type ReloadStateLayout,
  type ReloadStateProps,
} from '@/shared/components/ui/reload-state';

export type SlowRequestReloadStateProps = {
  onRetry?: () => void;
  layout?: ReloadStateLayout;
  className?: string;
  actionLabel?: ReloadStateProps['actionLabel'];
};

/**
 * Shared slow-request notice for surfaces that would otherwise show skeletons forever.
 */
export function SlowRequestReloadState({
  onRetry,
  layout = 'section',
  className,
  actionLabel = 'Reintentar',
}: SlowRequestReloadStateProps) {
  return (
    <ReloadState
      title={SLOW_REQUEST_NOTICE_TITLE}
      message={SLOW_REQUEST_NOTICE_MESSAGE}
      variant="warning"
      actionLabel={actionLabel}
      onAction={onRetry}
      layout={layout}
      className={className}
    />
  );
}
