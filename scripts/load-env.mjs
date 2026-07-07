import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
export const CANONICAL_PROFILES = ['local', 'qa', 'pro'];

/** @type {Record<string, string>} */
export const PROFILE_ALIASES = {
  dev: 'local',
  development: 'local',
  ei: 'local',
  mocks: 'local',
  offline: 'local',
  staging: 'qa',
  production: 'pro',
  prod: 'pro',
};

/** @type {Set<string> | null} */
let shellEnvKeys = null;

/**
 * @param {unknown} raw
 * @returns {'local' | 'qa' | 'pro'}
 */
export function normalizeProfile(raw) {
  const normalized = typeof raw === 'string' ? raw.trim().toLowerCase() : '';

  if (normalized.length === 0) {
    return 'local';
  }

  const aliased = PROFILE_ALIASES[normalized] ?? normalized;

  if (CANONICAL_PROFILES.includes(aliased)) {
    return /** @type {'local' | 'qa' | 'pro'} */ (aliased);
  }

  return 'local';
}

/**
 * @returns {'local' | 'qa' | 'pro'}
 */
export function resolveProfile() {
  const selector =
    process.env.INVERSORA_ENV ??
    process.env.EXPO_PUBLIC_APP_ENV ??
    process.env.APP_ENV ??
    process.env.ENV ??
    'local';

  return normalizeProfile(selector);
}

/**
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
export function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  /** @type {Record<string, string>} */
  const entries = {};
  const content = readFileSync(filePath, 'utf8');

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();

    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

/**
 * @param {string} key
 * @param {string} value
 * @param {'fill' | 'override'} mode
 */
function assignEnv(key, value, mode) {
  if (shellEnvKeys === null) {
    shellEnvKeys = new Set(Object.keys(process.env));
  }

  if (shellEnvKeys.has(key)) {
    return;
  }

  if (mode === 'fill' && process.env[key] !== undefined) {
    return;
  }

  process.env[key] = value;
}

/**
 * @param {string} filePath
 * @param {'fill' | 'override'} mode
 */
function applyEnvFile(filePath, mode) {
  for (const [key, value] of Object.entries(parseEnvFile(filePath))) {
    assignEnv(key, value, mode);
  }
}

/**
 * @param {{ profile?: 'local' | 'qa' | 'pro', projectRoot?: string }} [options]
 * @returns {'local' | 'qa' | 'pro'}
 */
export function loadEnv(options = {}) {
  if (shellEnvKeys === null) {
    shellEnvKeys = new Set(Object.keys(process.env));
  }

  const root = options.projectRoot ?? projectRoot;
  const profile = normalizeProfile(options.profile ?? resolveProfile());
  const envPath = resolve(root, '.env');
  const profilePath = resolve(root, 'env', `${profile}.env`);
  const profileOverridePath = resolve(root, `.env.${profile}`);

  if (!existsSync(envPath)) {
    throw new Error(
      `Missing ${envPath}. Copy .env.example and add optional overrides.`,
    );
  }

  applyEnvFile(envPath, 'fill');
  applyEnvFile(profilePath, 'override');
  applyEnvFile(profileOverridePath, 'override');

  process.env.INVERSORA_ENV = profile;
  process.env.EXPO_PUBLIC_APP_ENV = profile;

  if (process.env.INVERSORA_ENV_DEBUG === 'true') {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '(unset)';

    console.log(
      `[load-env] profile=${profile} api=${apiUrl} news=${process.env.EXPO_PUBLIC_NEWS_API_ENABLED ?? 'false'}`,
    );
  }

  return profile;
}

/**
 * Resets shell snapshot between tests.
 */
export function resetLoadEnvForTests() {
  shellEnvKeys = null;
}
