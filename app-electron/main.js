
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const express = require("express");
const http = require("http");


let mainWindow;
let server;
let apiProcess;


function createWindow() {
  // Start a static server to serve the Next.js export
  const staticApp = express();
  const outPath = path.join(__dirname, "../out");
  const publicPath = path.join(__dirname, "../public");
  // Serve public folder at root for images and static assets
  staticApp.use(express.static(publicPath));
  staticApp.use(express.static(outPath));
  staticApp.get('*', (req, res) => {
    res.sendFile(path.join(outPath, 'index.html'));
  });
  // Start the API server as a child process
  apiProcess = spawn(process.execPath, [path.join(__dirname, '../barbieri_api/index.js')], {
    cwd: path.join(__dirname, '../barbieri_api'),
    stdio: 'inherit'
  });

  server = http.createServer(staticApp);
  server.listen(3001, () => {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false
      }
    });
    mainWindow.loadURL('http://localhost:3001');
    mainWindow.on("closed", () => {
      if (server) server.close();
      if (apiProcess) apiProcess.kill();
      app.quit();
    });
  });
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  if (apiProcess) apiProcess.kill();
});
