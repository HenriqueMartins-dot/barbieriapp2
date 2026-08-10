const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let nextProcess;

app.setName("BarbieriApp");

const rootPath = app.isPackaged ? process.resourcesPath + "/app" : __dirname;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    height: 900
=======
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
>>>>>>> parent of 815d624 (ok)
  });

  mainWindow.loadURL("http://localhost:3000");
>>>>>>> parent of b9ff1cf (ok)
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
<<<<<<< HEAD
  if (!app.isPackaged) {
    startBackend();
    startFrontend();

    setTimeout(() => {
      createWindow();
    }, 3000);
    return;
  }

<<<<<<< HEAD
  startBackend();
  startFrontend();
=======
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
>>>>>>> parent of b9ff1cf (ok)
=======
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
>>>>>>> parent of 815d624 (ok)

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

<<<<<<< HEAD
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
=======
  if (process.platform !== "darwin") {
    app.quit();
>>>>>>> parent of 815d624 (ok)
  }
});