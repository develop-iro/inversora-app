import { spawn } from 'node:child_process';

const appEnv = process.argv[2];
const expoArgs = process.argv.slice(3);

if (appEnv === undefined || appEnv.trim().length === 0) {
  console.error('Usage: node scripts/run-expo-env.mjs <local|ei|qa|pro> [expo args...]');
  process.exit(1);
}

process.env.EXPO_PUBLIC_APP_ENV = appEnv.trim().toLowerCase();

const child = spawn('npx', ['expo', ...expoArgs], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
