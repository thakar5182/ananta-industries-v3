const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { once } = require('events');

let mainWin = null;
let httpServer = null;
let quitting = false;

async function startEmbeddedServer() {
  // Never spawn the packaged EXE. Start Express inside Electron's main process.
  // This avoids ENOENT errors for paths such as C:\\Program Files\\....
  const userDataDir = app.getPath('userData');
  fs.mkdirSync(userDataDir, { recursive: true });
  process.env.ANANTA_STORE_PATH = path.join(userDataDir, 'store.json');
  const secretPath = path.join(userDataDir, '.app-secret');
  if (!fs.existsSync(secretPath)) fs.writeFileSync(secretPath, require('crypto').randomBytes(48).toString('hex'), { mode: 0o600 });
  process.env.APP_SECRET = fs.readFileSync(secretPath, 'utf8').trim();

  const { startServer } = require(path.join(__dirname, '..', 'server.js'));
  httpServer = startServer(0); // OS picks a free localhost port; no port-conflict errors.
  await once(httpServer, 'listening');
  const address = httpServer.address();
  if (!address || typeof address !== 'object') throw new Error('Local server failed to start.');
  return `http://127.0.0.1:${address.port}`;
}

function createMain(url) {
  mainWin = new BrowserWindow({
    width: 1450,
    height: 900,
    minWidth: 1050,
    minHeight: 700,
    show: false,
    backgroundColor: '#09090b',
    icon: path.join(__dirname, '..', 'public', 'assets', 'ananta-icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  mainWin.once('ready-to-show', () => mainWin && mainWin.show());
  mainWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWin.webContents.on('will-navigate', (event, target) => { if (!target.startsWith(url)) event.preventDefault(); });
  mainWin.webContents.session.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  mainWin.loadURL(url).catch(err => {
    dialog.showErrorBox('Ananta Industries', `The application could not open its local dashboard.\n\n${err.message}`);
  });
}

app.whenReady().then(async () => {
  try {
    const url = await startEmbeddedServer();
    createMain(url);
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMain(url);
    });
  } catch (err) {
    dialog.showErrorBox('Ananta Industries - Startup Error', err?.stack || err?.message || String(err));
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  quitting = true;
  try { httpServer?.close(); } catch (_) {}
});

ipcMain.handle('save-invoice-pdf', async (_e, { name, html }) => {
  let win;
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Ananta Industries Invoice',
      defaultPath: name || 'Ananta-Invoice.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    if (canceled || !filePath) return { cancelled: true };

    win = new BrowserWindow({
      show: false,
      width: 900,
      height: 1200,
      webPreferences: { sandbox: true }
    });
    await win.loadURL('data:text/html;base64,' + Buffer.from(String(html || ''), 'utf8').toString('base64'));
    await new Promise(resolve => setTimeout(resolve, 250));
    const pdf = await win.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margins: { marginType: 'none' }
    });
    fs.writeFileSync(filePath, pdf);
    return { ok: true, filePath };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  } finally {
    try { win?.destroy(); } catch (_) {}
  }
});
