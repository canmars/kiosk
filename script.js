document.addEventListener('DOMContentLoaded', function() {
    // Menü butonları ile içerik geçişi
    const menuButtons = document.querySelectorAll('.menu-btn');
    const contentPages = document.querySelectorAll('.content-page');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            menuButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            contentPages.forEach(cp => {
                if (cp.id === page) {
                    cp.classList.add('active');
                } else {
                    cp.classList.remove('active');
                }
            });
        });
    });

    // Kroki üzerinde tıklama işlevselliği
    const krokiContainer = document.querySelector('.kroki-container');
    if (krokiContainer) {
        krokiContainer.addEventListener('click', (e) => {
            const rect = krokiContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Burada tıklanan konuma göre bilgi gösterme mantığı eklenebilir
            console.log(`Tıklanan konum: x=${x}, y=${y}`);
        });
    }

    // Proje Sergisi: Proje kartlarını dinamik olarak oluştur ve modalları yönet
    renderProjects();

    // Detay Modalı Dinleyici
    const projectDetailModalElement = document.getElementById('projectDetailModal');
    const projectDetailModal = new bootstrap.Modal(projectDetailModalElement);

    projectDetailModalElement.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Butonu tetikleyen element
        const projectData = JSON.parse(button.getAttribute('data-project').replace(/&apos;/g, "'"));
        
        document.getElementById('modalProjectTitle').textContent = projectData.title;
        document.getElementById('modalProjectCategory').textContent = projectData.category;
        document.getElementById('modalProjectDescription').textContent = projectData.description.replace(/\\n/g, '<br>');
        document.getElementById('modalStudentName').textContent = projectData.studentName;
        document.getElementById('modalStudentNumber').textContent = projectData.studentNumber;
        document.getElementById('modalProjectPhoto').src = projectData.projectPhotoUrl || 'assets/project-placeholder.png';
        document.getElementById('modalStudentPhoto').src = projectData.studentPhotoUrl || 'assets/student-placeholder.png';
        
        const tagsContainer = document.getElementById('modalProjectTags');
        tagsContainer.innerHTML = ''; // Önceki etiketleri temizle
        projectData.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'badge bg-primary me-1'; // Yeni badge stili
            span.textContent = tag;
            tagsContainer.appendChild(span);
        });

        document.getElementById('modalPosterLink').href = projectData.posterUrl || '#';
        document.getElementById('modalPdfLink').href = projectData.pdfUrl || '#';
    });
});

function renderProjects() {
    const projectCardsContainer = document.querySelector('#proje-sergisi .project-cards-container');
    if (!projectCardsContainer) return; // Kapsayıcı yoksa çık

    projectCardsContainer.innerHTML = ''; // Mevcut kartları temizle

    if (typeof projects !== 'undefined' && projects.length > 0) {
        projects.forEach(project => {
            const cardHtml = `
                <div class="project-card" data-project-id="${project.studentNumber}">
                    <img src="${project.projectPhotoUrl || 'assets/project-placeholder.png'}" alt="Proje Resmi" class="project-card-img">
                    <div class="project-card-content">
                        <h5 class="project-title">${project.title}</h5>
                        <p class="project-student-info">${project.studentName} (${project.studentNumber})</p>
                        <p class="project-description">${project.description.substring(0, 150)}...</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary project-details-btn" data-bs-toggle="modal" data-bs-target="#projectDetailModal" data-project='${JSON.stringify(project).replace(/'/g, "&apos;")}'>Detayları Gör</button>
                    </div>
                </div>
            `;
            projectCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    } else {
        projectCardsContainer.innerHTML = '<p class="text-center w-100">Proje verileri yüklenemedi veya bulunamadı.</p>';
    }
} 