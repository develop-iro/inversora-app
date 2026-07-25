import type { HttpDeleteOptions, HttpDeletePort } from '@/core/api/http-delete-port';
import { AppError } from '@/core/errors/app-error';

type MemoryHttpDeleteHandler = {
  path: string;
  status?: number;
  handler: () => unknown;
};

/**
 * In-memory DELETE double for application tests.
 *
 * @param routes - Path handlers for expected DELETE calls.
 */
export function createMemoryHttpDelete(routes: readonly MemoryHttpDeleteHandler[]): {
  apiDelete: HttpDeletePort;
  requests: HttpDeleteOptions[];
} {
  const requests: HttpDeleteOptions[] = [];

  const apiDelete: HttpDeletePort = async <TResponse>(options: HttpDeleteOptions) => {
    requests.push(options);
    const match = routes.find((route) => route.path === options.path);

    if (!match) {
      throw new AppError('API_REQUEST_FAILED', 'No matching DELETE handler.', undefined, 404);
    }

    const status = match.status ?? 200;

    if (status >= 400) {
      throw new AppError('API_REQUEST_FAILED', 'DELETE failed.', undefined, status);
    }

    return match.handler() as TResponse;
  };

  return { apiDelete, requests };
}
