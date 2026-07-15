/**
 * Upper bound for local secure-storage reads used by launch gates and tab routing.
 *
 * Prevents first-launch UX from hanging when SecureStore/AsyncStorage never settles.
 */
export const STORAGE_READ_TIMEOUT_MS = 3_000;

/**
 * Resolves a promise with a timeout fallback.
 *
 * @param promise - Asynchronous storage work.
 * @param timeoutMs - Maximum wait before returning `fallback`.
 * @param fallback - Value returned when the timeout fires first.
 */
export async function withStorageTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback: T,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
