const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  const isDev = !app.isPackaged;

  if (isDev) {
    createWindow();
    return;
  }

const nextBinary = path.join(
  app.getAppPath(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next"
);

nextProcess = spawn(
  nextBinary,
  ["start"],
  {
    cwd: app.getAppPath(),
    shell: true
  }
);

nextProcess.stdout.on("data", data => {
  console.log(data.toString());
});

nextProcess.stderr.on("data", data => {
  console.log(data.toString());
});
  setTimeout(() => {
    createWindow();
  }, 8000);
});

app.on("window-all-closed", () => {
  if (nextProcess) {
    nextProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});