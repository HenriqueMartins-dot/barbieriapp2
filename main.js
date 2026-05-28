const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let frontendProcess;
let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  if (!app.isPackaged) {
    createWindow();
    return;
  }

  const rootPath = process.resourcesPath + "/app";

  backendProcess = spawn(
    "cmd.exe",
    ["/c", "npm", "start"],
    {
      cwd: path.join(rootPath, "barbieri_api"),
      shell: true
    }
  );

  frontendProcess = spawn(
    "cmd.exe",
    ["/c", "npm", "start"],
    {
      cwd: rootPath,
      shell: true
    }
  );

  setTimeout(() => {
    createWindow();
  }, 12000);
});

app.on("window-all-closed", () => {
  if (frontendProcess) frontendProcess.kill();
  if (backendProcess) backendProcess.kill();

  app.quit();
});