import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { registerGitHandlers } from './git';

function applyCspHeaders(win: BrowserWindow) {
  // Enforce CSP via response headers (meta CSP can't reliably enforce frame-ancestors).
  // Only applies for the current window.
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = details.responseHeaders ?? {};

    const csp = "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:5173; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";

    responseHeaders['Content-Security-Policy'] = [csp];

    callback({ responseHeaders });
  });
}


function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, '..', '..', '..', 'Git Architect.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Debug: ouvrir DevTools pour voir l’erreur si l’UI reste blanche
  win.webContents.openDevTools({ mode: 'detach' });

  applyCspHeaders(win);

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
