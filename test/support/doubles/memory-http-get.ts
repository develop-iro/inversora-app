import type { HttpGetOptions, HttpGetPort } from '@/core/api/http-get-port';
import { AppError } from '@/core/errors/app-error';

export type MemoryHttpGetHandler = (
  options: HttpGetOptions,
) => unknown | Promise<unknown>;

export type MemoryHttpGetRoute = {
  /** Exact path match (e.g. `/funds`) or prefix when `prefix` is true. */
  path: string;
  prefix?: boolean;
  handler: MemoryHttpGetHandler;
};

/**
 * Creates an in-memory `HttpGetPort` for application integration tests.
 *
 * @param routes - Path handlers consulted in registration order.
 */
export function createMemoryHttpGet(routes: MemoryHttpGetRoute[] = []): {
  apiGet: HttpGetPort;
  requests: HttpGetOptions[];
  setRoutes: (next: MemoryHttpGetRoute[]) => void;
} {
  let activeRoutes = [...routes];
  const requests: HttpGetOptions[] = [];

  const apiGet: HttpGetPort = async <T>(options: HttpGetOptions): Promise<T> => {
    requests.push(options);

    const match = activeRoutes.find((route) =>
      route.prefix === true
        ? options.path.startsWith(route.path)
        : options.path === route.path,
    );

    if (match === undefined) {
      throw new AppError(
        'API_REQUEST_FAILED',
        `No memory HTTP route for GET ${options.path}`,
        undefined,
        404,
      );
    }

    return (await match.handler(options)) as T;
  };

  return {
    apiGet,
    requests,
    setRoutes: (next) => {
      activeRoutes = [...next];
    },
  };
}
