/**
 * Resolves the active app environment and related runtime config.
 */
export {
  APP_ENVIRONMENTS,
  allowsMockFallback,
  getAppEnvironment,
  getAppEnvironmentConfig,
  isDevDiagnosticsEnabled,
  isProductionRelease,
  parseAppEnvironment,
  resetAppEnvironmentConfigForTests,
  resolveApiBaseUrl,
  shouldUseMockData,
  type AppDataSource,
  type AppEnvironment,
  type AppEnvironmentConfig,
} from '@/core/config/app-environment';
