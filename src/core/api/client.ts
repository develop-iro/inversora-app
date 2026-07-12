import { AppError } from '@/core/errors/app-error';
import { resolveSafeApiErrorMessage } from '@/core/api/api-error-message';
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
    try {
      await response.json();
    } catch {
      // API error payloads are not trusted for user-facing copy.
    }

    throw new AppError(
      'API_REQUEST_FAILED',
      resolveSafeApiErrorMessage(response.status),
      undefined,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new AppError(
      'API_INVALID_RESPONSE',
      'La API devolvio una respuesta JSON invalida.',
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
