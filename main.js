const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let frontendProcess;
let backendProcess;

app.setName("BarbieriApp");

const rootPath = app.isPackaged ? process.resourcesPath + "/app" : __dirname;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#f4f8ff",
    title: "BarbieriApp",
    titleBarStyle: "default",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadURL("http://localhost:3000");
}

function startBackend() {
  if (backendProcess) {
    return;
  }

  const backendCommand = app.isPackaged
    ? ["npm", "start"]
    : ["npm", "run", "dev"];

  backendProcess = spawn("cmd.exe", ["/c", ...backendCommand], {
    cwd: path.join(rootPath, "barbieri_api"),
    shell: true,
  });
}

function startFrontend() {
  if (frontendProcess) {
    return;
  }

  const frontendCommand = app.isPackaged
    ? ["npm", "start"]
    : ["npm", "run", "dev"];

  frontendProcess = spawn("cmd.exe", ["/c", ...frontendCommand], {
    cwd: rootPath,
    shell: true,
  });
}

app.whenReady().then(() => {
  if (!app.isPackaged) {
    startBackend();
    startFrontend();

    setTimeout(() => {
      createWindow();
    }, 3000);
    return;
  }

  startBackend();
  startFrontend();

  setTimeout(() => {
    createWindow();
  }, 12000);
});

app.on("window-all-closed", () => {
  if (frontendProcess) frontendProcess.kill();
  if (backendProcess) backendProcess.kill();

  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});