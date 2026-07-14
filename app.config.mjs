import { loadEnv, resolveProfile } from './scripts/load-env.mjs';

/**
 * Loads committed profile env (`env/*.env`) before Metro inlines `EXPO_PUBLIC_*`.
 * Required for `expo export`, EAS Hosting, and local builds where Expo re-spawns workers.
 */
loadEnv({ profile: resolveProfile() });

const appEnv = process.env.EXPO_PUBLIC_APP_ENV?.trim() ?? 'local';
const easBuildProfile = process.env.EAS_BUILD_PROFILE?.trim();

/**
 * expo-dev-client must only be linked in EAS development profiles.
 * Preview/production IPAs bundle JS and crash when the dev launcher is embedded.
 */
const includeDevClient =
  easBuildProfile === 'development' || easBuildProfile === 'development-simulator';

/**
 * Sentry native hooks into AppDelegate even when JS init is skipped.
 * Link it only for production EAS builds where a DSN is configured.
 */
const includeSentry =
  easBuildProfile === 'production' &&
  (process.env.EXPO_PUBLIC_SENTRY_DSN?.trim()?.length ?? 0) > 0;

const plugins = [
  ...(includeDevClient ? ['expo-dev-client'] : []),
  ...(includeSentry ? ['@sentry/react-native'] : []),
  'expo-router',
  [
    'expo-splash-screen',
    {
      // Android 12+ requires a drawable logo resource during prebuild even when the
      // in-app launch overlay owns the branded wordmark animation.
      image: './assets/images/splash-icon.png',
      imageWidth: 1,
      resizeMode: 'contain',
      backgroundColor: '#0B2E36',
      ios: {
        backgroundColor: '#0B2E36',
      },
      android: {
        backgroundColor: '#0B2E36',
      },
    },
  ],
  'expo-status-bar',
  'expo-font',
  'expo-secure-store',
  'expo-sharing',
  [
    'expo-build-properties',
    {
      android: {
        usesCleartextTraffic: false,
      },
    },
  ],
  './plugins/with-ssl-pinning.js',
];

/** @param {{ config: import('@expo/config-types').ExpoConfig }} param0 */
export default ({ config }) => ({
  ...config,
  plugins,
});
