document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const contentPages = document.querySelectorAll('.content-page');
    const projectDetailModalElement = document.getElementById('projectDetailModal');

    // Menü butonları ile içerik geçişi
    menuButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            menuButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            contentPages.forEach(cp => {
                cp.classList.toggle('active', cp.id === page);
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
            console.log(`Tıklanan konum: x=${x}, y=${y}`);
        });
    }

    // Modal açıldığında verileri doldur
    if (projectDetailModalElement) {
        projectDetailModalElement.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            let projectData = {};
            try {
                projectData = JSON.parse(button.getAttribute('data-project').replace(/&apos;/g, "'"));
            } catch (e) {
                console.error("Proje verisi ayrıştırılamadı:", e);
                projectData = {};
            }

            // Medya konteynerini proje posteri veya fotoğrafı ile doldur
            const mediaContainer = document.getElementById('modalMediaContainer');
            if (projectData.posterUrl) {
                // Eğer poster varsa, iframe içinde göster
                mediaContainer.innerHTML = `<iframe src="${projectData.posterUrl}#toolbar=0" style="width: 100%; height: 100%; border: none;" title="Proje Posteri"></iframe>`;
            } else {
                // Eğer poster yoksa, proje fotoğrafını göster
                mediaContainer.innerHTML = `<img id="modalProjectPhoto" src="${projectData.projectPhotoUrl || 'assets/project-placeholder.png'}" alt="Proje Fotoğrafı" class="img-fluid rounded">`;
            }

            // Diğer modal içeriklerini doldur
            document.getElementById('modalStudentPhoto').src = projectData.studentPhotoUrl || 'assets/student-placeholder.png';
            document.getElementById('modalStudentName').textContent = projectData.studentName;
            document.getElementById('modalProjectTitle').textContent = projectData.title;
            document.getElementById('modalProjectCategory').textContent = projectData.category;
            document.getElementById('modalProjectDescription').textContent = projectData.description;

            const tagsContainer = document.getElementById('modalProjectTags');
            tagsContainer.innerHTML = '';
            if (projectData.tags && Array.isArray(projectData.tags)) {
                projectData.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'badge';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            }

            // Buton linklerini ayarla
            document.getElementById('modalPosterLink').href = projectData.posterUrl || '#';
            document.getElementById('modalPdfLink').href = projectData.pdfUrl || '#';
        });
    }

    // Medya Görüntüleyici Modalını Yönet
    const mediaViewerModalElement = document.getElementById('mediaViewerModal');
    const mediaViewerIframe = document.getElementById('mediaViewerIframe');

    mediaViewerModalElement.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        let mediaUrl = button.getAttribute('data-media-url') || button.getAttribute('href');

        if (mediaUrl && mediaUrl !== '#') {
            mediaViewerIframe.src = mediaUrl + '#toolbar=0';
        } else {
            // Eğer URL yoksa, modalın açılmasını engelle
            event.preventDefault();
            console.error('Gösterilecek medya URL\'si bulunamadı.');
        }
    });

    // Medya görüntüleyici kapandığında iframe'i temizle
    mediaViewerModalElement.addEventListener('hidden.bs.modal', function () {
        mediaViewerIframe.src = '';
    });

    // --- Projeler için Filtreleme Sistemi ---
    const projectSearchInput = document.getElementById('projectSearchInput');
    const projectCategoryFilter = document.getElementById('projectCategoryFilter');
    const projectSortFilter = document.getElementById('projectSortFilter');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const activeTagFilterDisplay = document.getElementById('activeTagFilterDisplay');
    const currentFilteredTag = document.getElementById('currentFilteredTag');
    const clearTagFilterBtn = document.getElementById('clearTagFilterBtn');

    // Kategorileri doldur
    const categories = ['Diğer Bilişim Projeleri', 'Eğitim', 'Oyun-Eğlence', 'Sanayi-Endüstri-Ticaret', 'Sağlık-Yaşam-Spor', 'Sosyal Medya ve İletişim', 'Şehir-Çevre-Doğa'];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        projectCategoryFilter.appendChild(option);
    });

    // Filtre olay dinleyicileri
    projectSearchInput.addEventListener('input', filterAndRenderProjects);
    projectCategoryFilter.addEventListener('change', filterAndRenderProjects);
    projectSortFilter.addEventListener('change', filterAndRenderProjects);
    resetFiltersBtn.addEventListener('click', () => {
        projectSearchInput.value = '';
        projectCategoryFilter.value = 'all';
        projectSortFilter.value = 'default';
        selectedTagFilter = null;
        filterAndRenderProjects();
    });

    clearTagFilterBtn.addEventListener('click', () => {
        selectedTagFilter = null;
        filterAndRenderProjects();
    });

    // Logo ve yazı kısmına tıklanınca Proje Sergisi'ne geçiş
    const goToProjeSergisi = document.getElementById('goToProjeSergisi');
    if (goToProjeSergisi) {
        goToProjeSergisi.style.cursor = 'pointer';
        goToProjeSergisi.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.menu-btn[data-page="proje-sergisi"]')?.click();
        });
    }

    // Başlangıçta projeleri render et
    filterAndRenderProjects();
});

let selectedTagFilter = null;

function filterByTag(tag) {
    document.getElementById('projectSearchInput').value = '';
    document.getElementById('projectCategoryFilter').value = 'all';
    selectedTagFilter = tag.toLowerCase();
    filterAndRenderProjects();
}

function filterAndRenderProjects() {
    const projectSearchInput = document.getElementById('projectSearchInput');
    const projectCategoryFilter = document.getElementById('projectCategoryFilter');
    const projectSortFilter = document.getElementById('projectSortFilter');
    const activeTagFilterDisplay = document.getElementById('activeTagFilterDisplay');
    const currentFilteredTag = document.getElementById('currentFilteredTag');

    const searchTerm = projectSearchInput.value.toLowerCase();
    const selectedCategory = projectCategoryFilter.value;
    const selectedSort = projectSortFilter.value;

    if (activeTagFilterDisplay) {
        if (selectedTagFilter) {
            activeTagFilterDisplay.style.display = 'flex';
            currentFilteredTag.textContent = selectedTagFilter.charAt(0).toUpperCase() + selectedTagFilter.slice(1);
        } else {
            activeTagFilterDisplay.style.display = 'none';
            currentFilteredTag.textContent = '';
        }
    }

    let filteredProjects = projects.filter(project => {
        const matchesSearchTerm = project.title.toLowerCase().includes(searchTerm) ||
                                  project.description.toLowerCase().includes(searchTerm) ||
                                  project.studentName.toLowerCase().includes(searchTerm) ||
                                  project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        const matchesTag = !selectedTagFilter || project.tags.some(tag => tag.toLowerCase() === selectedTagFilter);
        return matchesSearchTerm && matchesCategory && matchesTag;
    });

    if (selectedSort !== 'default') {
        filteredProjects.sort((a, b) => {
            let valA, valB;
            switch (selectedSort) {
                case 'title-asc': valA = a.title.toLowerCase(); valB = b.title.toLowerCase(); break;
                case 'title-desc': valA = b.title.toLowerCase(); valB = a.title.toLowerCase(); break;
                case 'student-asc': valA = a.studentName.toLowerCase(); valB = b.studentName.toLowerCase(); break;
                case 'student-desc': valA = b.studentName.toLowerCase(); valB = a.studentName.toLowerCase(); break;
                default: return 0;
            }
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
        });
    }

    renderProjects(filteredProjects);
}

function renderProjects(projectsToRender) {
    const projectCardsContainer = document.querySelector('#proje-sergisi .project-cards-container');
    if (!projectCardsContainer) return;
    projectCardsContainer.innerHTML = '';

    if (projectsToRender && projectsToRender.length > 0) {
        projectsToRender.forEach(project => {
            const card = document.createElement('div');
            card.className = 'darkcard';
            const safeProject = JSON.stringify(project).replace(/'/g, "&apos;");

            // Kategoriye göre class ismi oluştur
            function kategoriClass(str) {
                return (str || 'diger')
                    .toLowerCase()
                    .replace(/ç/g, 'c')
                    .replace(/ğ/g, 'g')
                    .replace(/ı/g, 'i')
                    .replace(/ö/g, 'o')
                    .replace(/ş/g, 's')
                    .replace(/ü/g, 'u')
                    .replace(/[^a-z0-9]/g, '');
            }
            const kategoriClassName = 'category-' + kategoriClass(project.category);

            card.innerHTML = `
                <div class="darkcard-profile">
                    <img src="${project.studentPhotoUrl || 'assets/student-placeholder.png'}" alt="${project.studentName}" class="darkcard-photo">
                    <div class="darkcard-name">${project.studentName}</div>
                </div>
                <div class="darkcard-title-wrapper">
                    <div class="darkcard-title">${project.title}</div>
                </div>
                <div class="darkcard-summary-label">Proje Özeti:</div>
                <div class="darkcard-desc darkcard-desc-8">${project.description}</div>
                <div class="darkcard-category-label">Proje Kategorisi:</div>
                <div class="darkcard-category-group">
                    <span class="darkcard-category ${kategoriClassName}">${project.category}</span>
                </div>
                <div class="darkcard-footer">
                    <button class="darkcard-btn" data-project='${safeProject}' data-bs-toggle="modal" data-bs-target="#projectDetailModal"><i class="bi bi-info-circle"></i> Detaylar</button>
                    ${project.posterUrl ? `<button class="darkcard-btn" data-media-url="${project.posterUrl}" data-bs-toggle="modal" data-bs-target="#mediaViewerModal"><i class="bi bi-image"></i> Poster</button>` : ''}
                    ${project.pdfUrl ? `<button class="darkcard-btn" data-media-url="${project.pdfUrl}" data-bs-toggle="modal" data-bs-target="#mediaViewerModal"><i class="bi bi-file-earmark-pdf"></i> Rapor</button>` : ''}
                </div>
            `;
            projectCardsContainer.appendChild(card);
        });
    } else {
        projectCardsContainer.innerHTML = '<p class="text-center w-100">Filtreleme kriterlerine uygun proje bulunamadı.</p>';
    }
}