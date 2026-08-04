const { spawn, execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'barbieri_api');
const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function killListeningProcesses() {
  try {
    const output = execSync(
      'powershell -NoProfile -Command "Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in 3000,3001 -and $_.State -eq \"Listen\" } | Select-Object -ExpandProperty OwningProcess -Unique"',
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );

    const pids = output
      .split(/\r?\n/)
      .map((line) => Number(String(line).trim()))
      .filter((pid) => Number.isFinite(pid) && pid > 0);

    const uniquePids = [...new Set(pids)];

    uniquePids.forEach((pid) => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      } catch {
        // Ignore if the process already exited.
      }
    });
  } catch {
    // Ignore cleanup failures; the main process can still start.
  }
}

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
    env: process.env,
    ...options,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      process.exit(code ?? 1);
    }
  });

  return child;
}

killListeningProcesses();

const api = run(npmExecutable, ['--prefix', backendDir, 'run', 'start']);
const frontend = run(npxExecutable, ['next', 'dev']);

const exitSignals = ['SIGINT', 'SIGTERM'];
exitSignals.forEach((signal) => {
  process.on(signal, () => {
    api.kill(signal);
    frontend.kill(signal);
    process.exit(0);
  });
});

frontend.on('exit', (code) => {
  if (code !== 0) {
    api.kill('SIGTERM');
    process.exit(code ?? 1);
  }
});

api.on('exit', (code) => {
  if (code !== 0) {
    frontend.kill('SIGTERM');
    process.exit(code ?? 1);
  }
});
