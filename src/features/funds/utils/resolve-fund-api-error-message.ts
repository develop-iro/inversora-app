import { AppError } from '@/core/errors/app-error';

/**
 * Returns a user-facing message for API-related failures.
 *
 * @param error - Unknown thrown value from a fund service call.
 */
export function resolveFundApiErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  return 'No se pudieron cargar los datos. Comprueba tu conexión e inténtalo de nuevo.';
}
