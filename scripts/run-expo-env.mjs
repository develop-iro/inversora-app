import { spawn } from 'node:child_process';
import { loadEnv, normalizeProfile } from './load-env.mjs';

const profileArg = process.argv[2];
const expoArgs = process.argv.slice(3);
const mcpFlagIndex = expoArgs.indexOf('--mcp');

if (mcpFlagIndex !== -1) {
  process.env.EXPO_UNSTABLE_MCP_SERVER = '1';
  expoArgs.splice(mcpFlagIndex, 1);
}

if (profileArg === undefined || profileArg.trim().length === 0) {
  console.error(
    'Usage: node scripts/run-expo-env.mjs <local|qa|pro> [expo args...] [--mcp]',
  );
  console.error('');
  console.error('Profiles:');
  console.error('  local — API local (http://localhost:3000), mock fallback si la API falla');
  console.error('  qa    — staging API');
  console.error('  pro   — production API');
  console.error('');
  console.error('Stack local con datos productivos:');
  console.error('  API: npm run start:pro   (inversora-api)');
  console.error('  App: npm run start:local');
  process.exit(1);
}

const profile = normalizeProfile(profileArg);
process.env.INVERSORA_ENV = profile;
loadEnv({ profile });

const child = spawn('npx', ['expo', ...expoArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
