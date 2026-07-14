import { loadEnv, resolveProfile } from './scripts/load-env.mjs';

/**
 * Loads committed profile env (`env/*.env`) before Metro inlines `EXPO_PUBLIC_*`.
 * Required for `expo export`, EAS Hosting, and local builds where Expo re-spawns workers.
 */
loadEnv({ profile: resolveProfile() });

const appEnv = process.env.EXPO_PUBLIC_APP_ENV?.trim() ?? 'local';
const includeDevClient = appEnv !== 'pro';

const plugins = [
  ...(includeDevClient ? ['expo-dev-client'] : []),
  '@sentry/react-native',
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
