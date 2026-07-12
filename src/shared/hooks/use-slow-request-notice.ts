import { useEffect, useState } from 'react';

import { SLOW_REQUEST_NOTICE_THRESHOLD_MS } from '@/shared/constants/slow-request-notice';

export type UseSlowRequestNoticeOptions = {
  /** Whether the surface is still waiting on data. */
  isLoading: boolean;
  /**
   * Optional key that restarts the timer when a retry begins without toggling
   * `isLoading` (for example, a reload token).
   */
  loadingKey?: string | number;
  /** Milliseconds before surfacing the slow-request notice. */
  thresholdMs?: number;
};

export type UseSlowRequestNoticeResult = {
  /** True when loading exceeded the threshold and the notice should replace skeletons. */
  isSlow: boolean;
};

/**
 * Returns whether a loading surface should show the slow-request notice instead
 * of indefinite skeletons.
 *
 * @param isLoading - Whether the request is in flight.
 * @param hasExceededThreshold - Whether elapsed time reached the threshold.
 */
export function shouldShowSlowRequestNotice(
  isLoading: boolean,
  hasExceededThreshold: boolean,
): boolean {
  return isLoading && hasExceededThreshold;
}

/**
 * Tracks how long a loading state has been active and flags slow requests.
 */
export function useSlowRequestNotice({
  isLoading,
  loadingKey,
  thresholdMs = SLOW_REQUEST_NOTICE_THRESHOLD_MS,
}: UseSlowRequestNoticeOptions): UseSlowRequestNoticeResult {
  const [hasExceededThreshold, setHasExceededThreshold] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timer = setTimeout(() => {
      setHasExceededThreshold(true);
    }, thresholdMs);

    return () => {
      clearTimeout(timer);
      setHasExceededThreshold(false);
    };
  }, [isLoading, loadingKey, thresholdMs]);

  return {
    isSlow: shouldShowSlowRequestNotice(isLoading, hasExceededThreshold),
  };
}
