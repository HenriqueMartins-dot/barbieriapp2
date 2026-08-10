const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let backendProcess;
let frontendProcess;

app.setName("BarbieriApp");

const rootPath = app.isPackaged ? process.resourcesPath + "/app" : __dirname;

function startBackend() {
  if (backendProcess) {
    return;
  }

  const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
  backendProcess = spawn(cmd, ["run", "dev"], {
    cwd: path.join(rootPath, "barbieri_api"),
    env: process.env,
    shell: false,
    stdio: "inherit",
  });
}

function startFrontend() {
  if (frontendProcess) {
    return;
  }

  const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
  frontendProcess = spawn(cmd, ["run", "dev"], {
    cwd: rootPath,
    env: process.env,
    shell: false,
    stdio: "inherit",
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#f4f8ff",
    title: "BarbieriApp",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  if (!app.isPackaged) {
    startBackend();
    startFrontend();
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (frontendProcess) {
    frontendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});