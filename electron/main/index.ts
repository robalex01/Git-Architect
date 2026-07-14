import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { registerGitHandlers } from './git';

const isDev = process.env.NODE_ENV === 'development' && !!process.env.VITE_DEV_SERVER_URL;

function applyCspHeaders(win: BrowserWindow) {
  // CSP appliquée via les en-têtes HTTP (une balise <meta> ne peut pas
  // appliquer "frame-ancestors", d'où le warning si on la mettait aussi là-bas).
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = details.responseHeaders ?? {};

    // 'unsafe-eval' n'est nécessaire qu'en dev, pour le HMR de Vite (React
    // Refresh utilise eval()). En production, le bundle buildé n'en a pas
    // besoin : on ne l'inclut jamais dans le binaire packagé, ce qui supprime
    // l'avertissement Electron "Insecure Content-Security-Policy".
    const csp = isDev
      ? "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:5173 ws://localhost:5173; font-src 'self' data:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
      : "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self' data:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";

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

  if (isDev) {
    // Utile uniquement en dev pour déboguer l'UI.
    win.webContents.openDevTools({ mode: 'detach' });
  }

  applyCspHeaders(win);

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL as string);
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
