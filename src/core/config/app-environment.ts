/** Supported Inversora mobile deployment environments. */
export const APP_ENVIRONMENTS = ['local', 'qa', 'pro'] as const;

/** Parsed mobile deployment environment. */
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

/** How catalog and BFF data is loaded in the running app. */
export type AppDataSource = 'api' | 'mock';

/** Resolved runtime configuration for the active environment. */
export type AppEnvironmentConfig = {
  readonly env: AppEnvironment;
  readonly apiBaseUrl: string;
  readonly dataSource: AppDataSource;
  /** When true, selected surfaces may fall back to local mocks if the API fails. */
  readonly allowMockFallback: boolean;
  /** When true, dev-only diagnostics and verbose tooling are enabled. */
  readonly enableDevDiagnostics: boolean;
  /** When true, the app targets a production-grade release build profile. */
  readonly isProductionRelease: boolean;
};

const DEFAULT_API_BASE_URLS: Readonly<Record<AppEnvironment, string>> = {
  local: 'http://localhost:3000',
  qa: 'https://inversora-api-qa.up.railway.app',
  pro: 'https://inversora-api-production.up.railway.app',
};

const ENVIRONMENT_DEFAULTS: Readonly<
  Record<
    AppEnvironment,
    Pick<
      AppEnvironmentConfig,
      'dataSource' | 'allowMockFallback' | 'enableDevDiagnostics' | 'isProductionRelease'
    >
  >
> = {
  local: {
    dataSource: 'api',
    allowMockFallback: true,
    enableDevDiagnostics: true,
    isProductionRelease: false,
  },
  qa: {
    dataSource: 'api',
    allowMockFallback: false,
    enableDevDiagnostics: true,
    isProductionRelease: false,
  },
  pro: {
    dataSource: 'api',
    allowMockFallback: false,
    enableDevDiagnostics: false,
    isProductionRelease: true,
  },
};

let cachedConfig: AppEnvironmentConfig | null = null;

/**
 * Parses the active deployment environment from `EXPO_PUBLIC_APP_ENV`.
 *
 * Set by `scripts/load-env.mjs` / `npm run start:<profile>` before Metro starts.
 * Selector priority when loading: `INVERSORA_ENV` → `EXPO_PUBLIC_APP_ENV` → `ENV`.
 *
 * @param raw - Raw environment variable value.
 */
export function parseAppEnvironment(raw: string | undefined): AppEnvironment {
  const normalized = raw?.trim().toLowerCase();

  if (
    normalized !== undefined &&
    (APP_ENVIRONMENTS as readonly string[]).includes(normalized)
  ) {
    return normalized as AppEnvironment;
  }

  return 'local';
}

/**
 * Resolves the API base URL for the active environment.
 *
 * `EXPO_PUBLIC_API_URL` overrides profile defaults when set.
 *
 * @param env - Active deployment environment.
 */
export function resolveApiBaseUrl(env: AppEnvironment): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (configured !== undefined && configured.length > 0) {
    return configured.replace(/\/+$/, '');
  }

  return DEFAULT_API_BASE_URLS[env].replace(/\/+$/, '');
}

/**
 * Returns the resolved configuration for the active app environment.
 */
export function getAppEnvironmentConfig(): AppEnvironmentConfig {
  if (cachedConfig !== null) {
    return cachedConfig;
  }

  const env = parseAppEnvironment(process.env.EXPO_PUBLIC_APP_ENV);
  const defaults = ENVIRONMENT_DEFAULTS[env];

  cachedConfig = {
    env,
    apiBaseUrl: resolveApiBaseUrl(env),
    dataSource: defaults.dataSource,
    allowMockFallback: defaults.allowMockFallback,
    enableDevDiagnostics: defaults.enableDevDiagnostics,
    isProductionRelease: defaults.isProductionRelease,
  };

  return cachedConfig;
}

/** Active deployment environment (`local`, `qa`, `pro`). */
export function getAppEnvironment(): AppEnvironment {
  return getAppEnvironmentConfig().env;
}

/** Whether the app must load catalog/BFF data from local mocks only. */
export function shouldUseMockData(): boolean {
  return getAppEnvironmentConfig().dataSource === 'mock';
}

/** Whether API failures may degrade to local educational mocks. */
export function allowsMockFallback(): boolean {
  return getAppEnvironmentConfig().allowMockFallback;
}

/** Whether dev diagnostics should be shown in the UI or logs. */
export function isDevDiagnosticsEnabled(): boolean {
  return getAppEnvironmentConfig().enableDevDiagnostics;
}

/** Whether the app runs under the production release profile. */
export function isProductionRelease(): boolean {
  return getAppEnvironmentConfig().isProductionRelease;
}

/**
 * Resets cached environment config (unit tests only).
 */
export function resetAppEnvironmentConfigForTests(): void {
  cachedConfig = null;
}
