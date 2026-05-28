const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900
  });

  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  if (!app.isPackaged) {
    createWindow();
    return;
  }

  const nextCli = path.join(
    process.resourcesPath,
    "app",
    "node_modules",
    "next",
    "dist",
    "bin",
    "next"
  );

  nextProcess = spawn(
    process.execPath,
    [nextCli, "start"],
    {
      cwd: process.resourcesPath + "/app",
      shell: true
    }
  );

  setTimeout(() => {
    createWindow();
  }, 10000);
});

app.on("window-all-closed", () => {
  if (nextProcess) {
    nextProcess.kill();
  }

  app.quit();
});