#!/usr/bin/env node
/**
 * Runs a production dependency audit with a pnpm release that talks to npm's
 * bulk advisory API. Legacy `/-/npm/v1/security/audits` returns HTTP 410.
 *
 * The repo remains pinned to pnpm 10 for installs; this script installs pnpm 11
 * into a temp prefix and audits against the existing lockfile + node_modules.
 */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNPM_AUDIT_VERSION = '11.13.0';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function printSpawnOutput(result) {
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}

const workDir = mkdtempSync(join(tmpdir(), 'inversora-audit-'));
const pnpmPrefix = join(workDir, 'pnpm');
const auditDir = join(workDir, 'project');

try {
  mkdirSync(pnpmPrefix, { recursive: true });
  mkdirSync(auditDir, { recursive: true });

  const install = run('npm', ['install', '--prefix', pnpmPrefix, `pnpm@${PNPM_AUDIT_VERSION}`], {
    cwd: workDir,
  });
  printSpawnOutput(install);

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }

  cpSync(join(ROOT, 'package.json'), join(auditDir, 'package.json'));
  cpSync(join(ROOT, 'pnpm-lock.yaml'), join(auditDir, 'pnpm-lock.yaml'));
  symlinkSync(join(ROOT, 'node_modules'), join(auditDir, 'node_modules'));

  const packageJson = JSON.parse(readFileSync(join(auditDir, 'package.json'), 'utf8'));
  delete packageJson.packageManager;
  delete packageJson.pnpm;
  writeFileSync(join(auditDir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);

  const pnpmBin = join(pnpmPrefix, 'node_modules', 'pnpm', 'bin', 'pnpm.cjs');
  const audit = run(
    process.execPath,
    [pnpmBin, 'audit', '--prod', '--audit-level', 'high'],
    { cwd: auditDir },
  );
  printSpawnOutput(audit);
  process.exit(audit.status ?? 1);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
