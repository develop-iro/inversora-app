import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  loadEnv,
  normalizeProfile,
  resetLoadEnvForTests,
  resolveProfileFromEasBuildProfile,
} from './load-env.mjs';

describe('resolveProfileFromEasBuildProfile', () => {
  it('maps EAS build profiles to committed env profiles', () => {
    assert.equal(resolveProfileFromEasBuildProfile('production-internal'), 'pro');
    assert.equal(resolveProfileFromEasBuildProfile('production'), 'pro');
    assert.equal(resolveProfileFromEasBuildProfile('preview'), 'pro');
    assert.equal(resolveProfileFromEasBuildProfile('development'), 'local');
    assert.equal(resolveProfileFromEasBuildProfile('development-simulator'), 'local');
    assert.equal(resolveProfileFromEasBuildProfile(undefined), undefined);
  });
});

describe('normalizeProfile', () => {
  it('accepts canonical mobile profiles', () => {
    assert.equal(normalizeProfile('local'), 'local');
    assert.equal(normalizeProfile('qa'), 'qa');
    assert.equal(normalizeProfile('pro'), 'pro');
  });

  it('maps legacy ei and offline aliases to local', () => {
    assert.equal(normalizeProfile('ei'), 'local');
    assert.equal(normalizeProfile('mocks'), 'local');
    assert.equal(normalizeProfile('offline'), 'local');
    assert.equal(normalizeProfile('dev'), 'local');
    assert.equal(normalizeProfile('staging'), 'qa');
  });
});

describe('loadEnv', () => {
  /** @type {string | undefined} */
  let tempRoot;

  beforeEach(() => {
    resetLoadEnvForTests();
    delete process.env.EXPO_PUBLIC_APP_ENV;
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_NEWS_API_ENABLED;
    delete process.env.INVERSORA_ENV;

    tempRoot = mkdtempSync(join(tmpdir(), 'inversora-app-load-env-'));
    mkdirSync(join(tempRoot, 'env'), { recursive: true });
    writeFileSync(
      join(tempRoot, '.env'),
      'EXPO_PUBLIC_NEWS_API_ENABLED=true\nEXPO_PUBLIC_API_URL=http://from-dotenv\n',
    );
    writeFileSync(
      join(tempRoot, 'env', 'local.env'),
      'EXPO_PUBLIC_APP_ENV=local\nEXPO_PUBLIC_API_URL=http://localhost:3000\n',
    );
  });

  afterEach(() => {
    resetLoadEnvForTests();
    if (tempRoot !== undefined) {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('loads local profile defaults over generic .env infrastructure keys', () => {
    loadEnv({ projectRoot: tempRoot, profile: 'local' });

    assert.equal(process.env.EXPO_PUBLIC_APP_ENV, 'local');
    assert.equal(process.env.EXPO_PUBLIC_API_URL, 'http://localhost:3000');
    assert.equal(process.env.INVERSORA_ENV, 'local');
    assert.equal(process.env.EXPO_PUBLIC_NEWS_API_ENABLED, 'true');
  });

  it('maps legacy ei selector to local profile defaults', () => {
    loadEnv({ projectRoot: tempRoot, profile: normalizeProfile('ei') });

    assert.equal(process.env.EXPO_PUBLIC_APP_ENV, 'local');
    assert.equal(process.env.INVERSORA_ENV, 'local');
    assert.equal(process.env.EXPO_PUBLIC_API_URL, 'http://localhost:3000');
  });

  it('loads committed profile env on EAS when .env is absent', () => {
    delete process.env.EAS_BUILD;
    process.env.EAS_BUILD = 'true';

    const rootWithoutDotEnv = mkdtempSync(
      join(tmpdir(), 'inversora-app-load-env-eas-'),
    );
    mkdirSync(join(rootWithoutDotEnv, 'env'), { recursive: true });
    writeFileSync(
      join(rootWithoutDotEnv, 'env', 'local.env'),
      'EXPO_PUBLIC_APP_ENV=local\nEXPO_PUBLIC_API_URL=http://localhost:3000\n',
    );

    try {
      loadEnv({ projectRoot: rootWithoutDotEnv, profile: 'local' });

      assert.equal(process.env.EXPO_PUBLIC_APP_ENV, 'local');
      assert.equal(process.env.EXPO_PUBLIC_API_URL, 'http://localhost:3000');
    } finally {
      delete process.env.EAS_BUILD;
      rmSync(rootWithoutDotEnv, { recursive: true, force: true });
    }
  });
});
