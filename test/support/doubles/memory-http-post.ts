import type { HttpPostOptions, HttpPostPort } from '@/core/api/http-post-port';
import { AppError } from '@/core/errors/app-error';

export type MemoryHttpPostHandler = <TBody>(
  options: HttpPostOptions<TBody>,
) => unknown | Promise<unknown>;

export type MemoryHttpPostRoute = {
  path: string;
  handler: MemoryHttpPostHandler;
};

/**
 * Creates an in-memory `HttpPostPort` for application integration tests.
 *
 * @param routes - Path handlers consulted in registration order.
 */
export function createMemoryHttpPost(routes: MemoryHttpPostRoute[] = []): {
  apiPost: HttpPostPort;
  requests: HttpPostOptions<unknown>[];
  setRoutes: (next: MemoryHttpPostRoute[]) => void;
} {
  let activeRoutes = [...routes];
  const requests: HttpPostOptions<unknown>[] = [];

  const apiPost: HttpPostPort = async <TResponse, TBody>(
    options: HttpPostOptions<TBody>,
  ): Promise<TResponse> => {
    requests.push(options as HttpPostOptions<unknown>);

    const match = activeRoutes.find((route) => route.path === options.path);

    if (match === undefined) {
      throw new AppError(
        'API_REQUEST_FAILED',
        `No memory HTTP route for POST ${options.path}`,
        undefined,
        404,
      );
    }

    return (await match.handler(options)) as TResponse;
  };

  return {
    apiPost,
    requests,
    setRoutes: (next) => {
      activeRoutes = [...next];
    },
  };
}
