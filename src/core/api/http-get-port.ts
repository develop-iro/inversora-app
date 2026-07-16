/**
 * Options for a JSON GET against the Inversora API.
 */
export type HttpGetOptions = {
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  /** When true, attaches `X-Device-Token` when the installation is registered. */
  withDeviceToken?: boolean;
  /** Optional override for the default request timeout in milliseconds. */
  timeoutMs?: number;
};

/**
 * Port for JSON GET requests used by application services.
 *
 * Production binds {@link apiGet} from `@/core/api/client`.
 * Tests inject an in-memory double so suites never load React Native.
 */
export type HttpGetPort = <T>(options: HttpGetOptions) => Promise<T>;
