#!/usr/bin/env node
/**
 * Prints recommended EXPO_PUBLIC_API_URL values for local development.
 *
 * Usage:
 *   node scripts/print-api-url.mjs
 *   node scripts/print-api-url.mjs --ios
 *   node scripts/print-api-url.mjs --android
 *   node scripts/print-api-url.mjs --lan
 *   node scripts/print-api-url.mjs --staging https://your-api.railway.app
 */

import os from 'node:os';

const API_PORT = process.env.INVERSORA_API_PORT ?? '3000';

/**
 * @returns {string | undefined} First non-internal IPv4 address.
 */
function resolveLanIpv4() {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    if (entries === undefined) {
      continue;
    }

    for (const entry of entries) {
      const isIpv4 = entry.family === 'IPv4' || entry.family === 4;

      if (isIpv4 && entry.internal === false) {
        return entry.address;
      }
    }
  }

  return undefined;
}

/**
 * @param {string} host
 * @returns {string}
 */
function buildApiUrl(host) {
  return `http://${host}:${API_PORT}`;
}

const args = new Set(process.argv.slice(2));
const stagingUrl = process.argv
  .slice(2)
  .find((arg, index, list) => list[index - 1] === '--staging');

if (stagingUrl !== undefined) {
  console.log(`EXPO_PUBLIC_API_URL=${stagingUrl.replace(/\/+$/, '')}`);
  process.exit(0);
}

if (args.has('--ios')) {
  console.log(`EXPO_PUBLIC_API_URL=${buildApiUrl('localhost')}`);
  process.exit(0);
}

if (args.has('--android')) {
  console.log(`EXPO_PUBLIC_API_URL=${buildApiUrl('10.0.2.2')}`);
  process.exit(0);
}

if (args.has('--lan')) {
  const lanIp = resolveLanIpv4();

  if (lanIp === undefined) {
    console.error('No LAN IPv4 found. Connect to Wi‑Fi or Ethernet and retry.');
    process.exit(1);
  }

  console.log(`EXPO_PUBLIC_API_URL=${buildApiUrl(lanIp)}`);
  process.exit(0);
}

const lanIp = resolveLanIpv4();

console.log('Suggested EXPO_PUBLIC_API_URL values (copy one into invesora/.env):\n');
console.log(`  iOS Simulator:     ${buildApiUrl('localhost')}`);
console.log(`  Android Emulator:  ${buildApiUrl('10.0.2.2')}`);
console.log(
  `  Physical device:   ${lanIp === undefined ? '(no LAN IP detected)' : buildApiUrl(lanIp)}`,
);
console.log(`  Expo web:          ${buildApiUrl('localhost')}  (requires CORS on the API)`);
console.log('\nShortcuts:');
console.log('  npm run api:url -- --ios');
console.log('  npm run api:url -- --android');
console.log('  npm run api:url -- --lan');
console.log('  npm run api:url -- --staging https://your-api.railway.app');
