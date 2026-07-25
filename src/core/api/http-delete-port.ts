/**
 * Options for a JSON DELETE against the Inversora API.
 */
export type HttpDeleteOptions = {
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  /** When true, attaches `X-Device-Token` when the installation is registered. */
  withDeviceToken?: boolean;
  /** Optional override for the default request timeout in milliseconds. */
  timeoutMs?: number;
};

/**
 * Port for JSON DELETE requests used by application services.
 *
 * Production binds {@link apiDelete} from `@/core/api/client`.
 * Tests inject an in-memory double so suites never load React Native.
 */
export type HttpDeletePort = <TResponse>(options: HttpDeleteOptions) => Promise<TResponse>;
