import { loadEnv, resolveProfile } from './scripts/load-env.mjs';

/**
 * Loads committed profile env (`env/*.env`) before Metro inlines `EXPO_PUBLIC_*`.
 * Required for `expo export`, EAS Hosting, and local builds where Expo re-spawns workers.
 */
loadEnv({ profile: resolveProfile() });

/** @param {{ config: import('@expo/config-types').ExpoConfig }} param0 */
export default ({ config }) => config;
