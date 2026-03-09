import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let phpServer: ChildProcess | null = null;

function startLaravelServer() {
  let apiPath: string;
  if (app.isPackaged) {
    apiPath = path.join(process.resourcesPath, 'ready-api');
  } else {
    apiPath = path.resolve(process.cwd(), '../ready-api');
  }
  
  if (!fs.existsSync(apiPath)) return;

  try {
      phpServer = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'], {
        cwd: apiPath,
        shell: true, 
      });
  } catch (e) {
      console.error('Failed to spawn PHP process:', e);
  }
}

process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  // --- AUTO-FIT LOGIC START ---
  // Get the primary display dimensions (width/height of the monitor)
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Option A: Set to a percentage of the screen (e.g., 90% width, 85% height)
  const windowWidth = Math.floor(width * 0.9);
  const windowHeight = Math.floor(height * 0.85);
  // --- AUTO-FIT LOGIC END ---

  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 1024,      // Ensures UI doesn't break on very small screens
    minHeight: 768,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    show: false,         // Keeps it hidden until calculations/loading are done
    autoHideMenuBar: false, // Keeps the menu bar visible for better user experience
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.once('ready-to-show', () => {
    // Option B: To fit the screen perfectly (Maximized), use this:
    win?.maximize(); 
    win?.show();
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

app.on('will-quit', () => {
  if (phpServer?.pid) {
    if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', phpServer.pid.toString(), '/f', '/t']);
    } else {
        phpServer.kill();
    }
  }
});

app.whenReady().then(() => {
    startLaravelServer();
    createWindow();
})