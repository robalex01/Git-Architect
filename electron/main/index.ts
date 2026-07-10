import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { registerGitHandlers } from './git';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, '..', '..', '..', 'Git Architect.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Vite dev server url
  if (process.env.NODE_ENV === 'development' && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexHtml = path.join(__dirname, '..', '..', '..', 'renderer', 'dist', 'index.html');
    if (fs.existsSync(indexHtml)) {
      win.loadFile(indexHtml);
    } else {
      win.loadURL('about:blank');
    }
  }
}

app.whenReady().then(() => {
  registerGitHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('gitarch:appPaths', async () => {
  return { appData: app.getPath('userData') };
});
