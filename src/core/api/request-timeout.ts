/**
 * Default timeout for Inversora API HTTP calls.
 *
 * Native production builds must not wait indefinitely when the network stalls;
 * 15s is above the educational slow-request notice (~8s) and below typical UX abandon.
 */
export const API_REQUEST_TIMEOUT_MS = 15_000;

/**
 * Combines an optional abort signal with a timeout signal.
 *
 * @param timeoutMs - Timeout in milliseconds.
 * @param externalSignal - Optional caller-provided abort signal.
 */
export function createTimedAbortSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal,
): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  let settled = false;

  const abortFromTimeout = () => {
    if (settled) {
      return;
    }

    settled = true;
    controller.abort();
  };

  const abortFromExternal = () => {
    if (settled) {
      return;
    }

    settled = true;
    controller.abort();
  };

  const timeoutId = setTimeout(abortFromTimeout, timeoutMs);

  if (externalSignal !== undefined) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      abortFromExternal();
    } else {
      externalSignal.addEventListener('abort', abortFromExternal, { once: true });
    }
  }

  return {
    signal: controller.signal,
    clear: () => {
      settled = true;
      clearTimeout(timeoutId);

      if (externalSignal !== undefined) {
        externalSignal.removeEventListener('abort', abortFromExternal);
      }
    },
  };
}
