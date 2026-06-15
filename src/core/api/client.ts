import { AppError } from '@/core/errors/app-error';
import { getApiBaseUrl } from '@/core/api/config';

type ApiRequestOptions = {
  path: string;
  searchParams?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
};

/**
 * Performs a JSON GET request against the Inversora API.
 *
 * @param options - Request path and optional query parameters.
 */
export async function apiGet<T>(options: ApiRequestOptions): Promise<T> {
  const url = new URL(options.path, `${getApiBaseUrl()}/`);

  if (options.searchParams !== undefined) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: options.signal,
    });
  } catch (error) {
    throw new AppError(
      'API_REQUEST_FAILED',
      'No se pudo conectar con la API de Inversora.',
      error,
    );
  }

  if (!response.ok) {
    const message =
      response.status === 404
        ? 'El recurso solicitado no existe en la API.'
        : response.status === 503
          ? 'La API no está disponible temporalmente. Inténtalo de nuevo en unos minutos.'
          : `La API respondió con estado ${response.status}.`;

    throw new AppError('API_REQUEST_FAILED', message, undefined, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La API devolvió una respuesta JSON inválida.',
      error,
    );
  }
}
