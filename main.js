const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Proje sergisi web sitesini yükle
  win.loadURL('https://projesergisi.vahaptecim.com.tr/');

  // F11 tuşu ile tam ekran modunu kapatma
  win.on('keydown', (event) => {
    if (event.key === 'F11') {
      win.setFullScreen(false);
      win.setKiosk(false);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 