const projects = [
  {
    title: "Akıllı Kampüs Yönetim Sistemi",
    studentName: "Ayşe Yılmaz",
    studentNumber: "123456",
    description: "Kampüs içi kaynakların verimli yönetimi için web tabanlı bir platform.",
    pdfUrl: "assets/rapor-1.pdf",
    posterUrl: "assets/rapor-1.pdf",
    photoUrl: "assets/deneme-1.png"
  },
  {
    title: "Mobil Sağlık Takip Uygulaması",
    studentName: "Mehmet Demir",
    studentNumber: "654321",
    description: "Kullanıcıların sağlık verilerini takip edebileceği mobil uygulama.",
    pdfUrl: "assets/rapor2.pdf",
    posterUrl: "assets/poster2.pdf",
    photoUrl: "assets/poster1.png"
  },
  {
    title: "Veri Analitiği ile Satış Tahmini",
    studentName: "Zeynep Kaya",
    studentNumber: "789012",
    description: "Makine öğrenmesi ile satış tahminlemesi yapan analiz platformu.",
    pdfUrl: "assets/rapor3.pdf",
    posterUrl: "assets/poster3.pdf",
    photoUrl: "assets/poster1.png"
  }
];

function renderProjects() {
  const container = document.querySelector('#proje-sergisi .row');
  if (!container) return;
  container.innerHTML = '';
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    card.innerHTML = `
      <div class="card project-card h-100 shadow-sm">
        <img src="${p.photoUrl || ''}" class="card-img-top" alt="${p.title || 'Proje'}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold text-primary">${p.title || 'İsimsiz Proje'}</h5>
          <div class="mb-2 small text-secondary">Öğrenci: <span class="fw-semibold">${p.studentName || ''}</span></div>
          <div class="mb-2 small text-secondary">Numara: <span class="fw-semibold">${p.studentNumber || ''}</span></div>
          <p class="card-text flex-grow-1">${p.description || ''}</p>
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
    modalTitle.textContent = p.title || 'Proje Detayı';
    modalBody.innerHTML = `<strong>Öğrenci:</strong> ${p.studentName || ''} (${p.studentNumber || ''})<br><br><strong>Açıklama:</strong><br>${p.description || ''}`;
  } else if (type === 'rapor') {
    modalTitle.textContent = (p.title || '') + ' - Rapor';
    modalBody.innerHTML = `<embed src="${p.pdfUrl || ''}" type="application/pdf" width="100%" height="500px" />`;
  } else if (type === 'poster') {
    modalTitle.textContent = (p.title || '') + ' - Poster';
    modalBody.innerHTML = `<embed src="${p.posterUrl || ''}" type="application/pdf" width="100%" height="500px" />`;
  }
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
}

document.addEventListener('DOMContentLoaded', renderProjects); 