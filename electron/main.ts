import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Global reference for PHP server
let phpServer: ChildProcess | null = null;

// Function to start the PHP server
function startLaravelServer() {
  let apiPath: string;

  if (app.isPackaged) {
    // In production, the API folder is in the resources directory
    apiPath = path.join(process.resourcesPath, 'ready-api');
  } else {
    // In development, assume it's a sibling of the project root
    apiPath = path.resolve(process.cwd(), '../ready-api');
  }
  
  // Also check if we are in development and the path is different
  if (!fs.existsSync(apiPath)) {
      // Logic for alternative paths if needed
      console.log(`Laravel API not found at: ${apiPath}`);
      return; 
  }
  
  console.log('Attempting to start Laravel server in:', apiPath);

  try {
      phpServer = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'], {
        cwd: apiPath,
        shell: true, 
      });

      phpServer.stdout?.on('data', (data) => {
        console.log(`[Laravel]: ${data}`);
      });

      phpServer.stderr?.on('data', (data) => {
        console.error(`[Laravel Error]: ${data}`);
      });

      phpServer.on('close', (code) => {
        console.log(`[Laravel]: Server exited with code ${code}`);
      });
      
      phpServer.on('error', (err) => {
          console.error('[Laravel Spawn Error]:', err);
      });
  } catch (e) {
      console.error('Failed to spawn PHP process:', e);
  }
}


// The built directory structure
//
// ├─┬─ dist
// │ └── index.html
// │
// ├─┬─ dist-electron
// │ ├── main.js
// │ └── preload.js
//
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('will-quit', () => {
  if (phpServer?.pid) {
     // On Windows, killing the changing shell process might not kill the child php server. 
     // Using taskkill is more reliable for process trees started via shell: true
    if (process.platform === 'win32') {
        try {
            spawn('taskkill', ['/pid', phpServer.pid.toString(), '/f', '/t']);
        } catch (e) {
            console.error('Failed to kill PHP server:', e);
        }
    } else {
        phpServer.kill();
    }
  }
});

app.whenReady().then(() => {
    startLaravelServer();
    createWindow();
})
