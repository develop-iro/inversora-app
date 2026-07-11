import { AppError } from '@/core/errors/app-error';
import { getApiBaseUrl } from '@/core/api/config';
import { deviceIdentityStore } from '@/core/storage/device-identity-store';

type ApiRequestOptions = {
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  /** When true, attaches `X-Device-Token` when the installation is registered. */
  withDeviceToken?: boolean;
};

type ApiPostOptions<TBody> = ApiRequestOptions & {
  body: TBody;
};

type ApiPutOptions<TBody> = ApiPostOptions<TBody>;
type ApiPatchOptions<TBody> = ApiPostOptions<TBody>;

type ApiErrorPayload = {
  message?: string | string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseApiErrorMessage(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }

  const { message } = payload as ApiErrorPayload;

  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  if (Array.isArray(message)) {
    const joined = message
      .filter((entry): entry is string => typeof entry === 'string')
      .join(' ');

    return joined.trim().length > 0 ? joined : null;
  }

  return null;
}

function buildRequestUrl(options: ApiRequestOptions): URL {
  const url = new URL(options.path, `${getApiBaseUrl()}/`);

  if (options.searchParams !== undefined) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

async function buildJsonHeaders(
  options: ApiRequestOptions,
  includeBody: boolean,
): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (includeBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.withDeviceToken) {
    const deviceToken = await deviceIdentityStore.getDeviceToken();

    if (deviceToken) {
      headers['X-Device-Token'] = deviceToken;
    }
  }

  return headers;
}

async function requestJson<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH',
  options: ApiRequestOptions,
  body?: unknown,
): Promise<T> {
  const url = buildRequestUrl(options);
  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method,
      headers: await buildJsonHeaders(options, body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: options.signal,
    });
  } catch (error) {
    throw new AppError(
      'API_REQUEST_FAILED',
      'No se pudo conectar con la API de Inversora.',
      error,
    );
  }

  return parseApiResponse<T>(response);
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let apiMessage: string | null = null;

    try {
      apiMessage = parseApiErrorMessage(await response.json());
    } catch {
      apiMessage = null;
    }

    const fallbackMessage =
      response.status === 404
        ? 'El recurso solicitado no existe en la API.'
        : response.status === 503
          ? 'La API no está disponible temporalmente. Inténtalo de nuevo en unos minutos.'
          : response.status === 400
            ? 'La petición no es válida para el asistente SORA.'
            : `La API respondió con estado ${response.status}.`;
    const message = apiMessage ?? fallbackMessage;

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

/**
 * Performs a JSON GET request against the Inversora API.
 *
 * @param options - Request path and optional query parameters.
 */
export async function apiGet<T>(options: ApiRequestOptions): Promise<T> {
  return requestJson<T>('GET', options);
}

/**
 * Performs a JSON POST request against the Inversora API.
 *
 * @param options - Request path, body payload, and optional query parameters.
 */
export async function apiPost<TResponse, TBody>(
  options: ApiPostOptions<TBody>,
): Promise<TResponse> {
  return requestJson<TResponse>('POST', options, options.body);
}

/**
 * Performs a JSON PUT request against the Inversora API.
 *
 * @param options - Request path, body payload, and optional query parameters.
 */
export async function apiPut<TResponse, TBody>(options: ApiPutOptions<TBody>): Promise<TResponse> {
  return requestJson<TResponse>('PUT', { ...options, withDeviceToken: true }, options.body);
}

/**
 * Performs a JSON PATCH request against the Inversora API.
 *
 * @param options - Request path, body payload, and optional query parameters.
 */
export async function apiPatch<TResponse, TBody>(
  options: ApiPatchOptions<TBody>,
): Promise<TResponse> {
  return requestJson<TResponse>('PATCH', { ...options, withDeviceToken: true }, options.body);
}
