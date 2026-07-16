/**
 * Options for a JSON POST against the Inversora API.
 */
export type HttpPostOptions<TBody> = {
  path: string;
  body: TBody;
  searchParams?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  /** When true, attaches `X-Device-Token` when the installation is registered. */
  withDeviceToken?: boolean;
  /** Optional override for the default request timeout in milliseconds. */
  timeoutMs?: number;
};

/**
 * Port for JSON POST requests used by application services.
 *
 * Production binds {@link apiPost} from `@/core/api/client`.
 * Tests inject an in-memory double so suites never load React Native.
 */
export type HttpPostPort = <TResponse, TBody>(
  options: HttpPostOptions<TBody>,
) => Promise<TResponse>;
