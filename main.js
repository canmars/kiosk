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
  win.loadFile('index.html');

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

function renderProjects() {
  const container = document.querySelector('#proje-sergisi .row');
  if (!container) return;
  container.innerHTML = '';
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    card.innerHTML = `
      <div class="card project-card h-100 shadow-sm">
        <img src="${p.afis_url}" class="card-img-top" alt="${p.proje_adi}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold text-primary">${p.proje_adi}</h5>
          <div class="mb-2 small text-secondary">Öğrenci: <span class="fw-semibold">${p.ogrenci}</span></div>
          <div class="mb-2 small text-secondary">Danışman: <span class="fw-semibold">${p.danisman}</span></div>
          <p class="card-text flex-grow-1">${p.ozet.substring(0, 60)}...</p>
          <div class="mt-2 d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" onclick="showModal(${i}, 'rapor')">Raporu Görüntüle</button>
            <button class="btn btn-outline-secondary btn-sm" onclick="showModal(${i}, 'poster')">Posteri Görüntüle</button>
            <button class="btn btn-link btn-sm text-info" onclick="showModal(${i}, 'detay')">Detaylar</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.showModal = function(idx, type) {
  const p = projects[idx];
  const modal = document.getElementById('projectModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  if (type === 'detay') {
    modalTitle.textContent = p.proje_adi;
    modalBody.innerHTML = `<strong>Öğrenci:</strong> ${p.ogrenci}<br><strong>Danışman:</strong> ${p.danisman}<br><br><strong>Özet:</strong><br>${p.ozet}`;
  } else if (type === 'rapor') {
    modalTitle.textContent = p.proje_adi + ' - Rapor';
    modalBody.innerHTML = `<embed src="${p.rapor_url}" type="application/pdf" width="100%" height="500px" />`;
  } else if (type === 'poster') {
    modalTitle.textContent = p.proje_adi + ' - Poster';
    modalBody.innerHTML = `<embed src="${p.poster_url}" type="application/pdf" width="100%" height="500px" />`;
  }
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
}

document.addEventListener('DOMContentLoaded', renderProjects); 