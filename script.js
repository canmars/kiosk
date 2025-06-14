document.addEventListener('DOMContentLoaded', function() {
    // Menü butonları ile içerik geçişi
    const menuButtons = document.querySelectorAll('.menu-btn');
    const contentPages = document.querySelectorAll('.content-page');

    menuButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Aktif menü butonunu güncelle
            menuButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Sayfa geçişini yap
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
    // renderProjects(); // Bu çağrı aşağıda filterAndRenderProjects() tarafından yapılacak

    // Detay Modalı Dinleyici
    const projectDetailModalElement = document.getElementById('projectDetailModal');
    const projectDetailModal = new bootstrap.Modal(projectDetailModalElement);

    projectDetailModalElement.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Butonu tetikleyen element
        const projectData = JSON.parse(button.getAttribute('data-project').replace(/&apos;/g, "'"));
        
        // Modal her açıldığında detayları göster, medya içeriğini gizle
        document.getElementById('projectDetailsContent').style.display = 'flex';
        document.getElementById('projectMediaContent').style.display = 'none';
        document.getElementById('modalMediaViewer').src = ''; // iFrame src'sini temizle

        document.getElementById('modalProjectTitle').textContent = projectData.title;
        document.getElementById('modalProjectCategory').textContent = projectData.category;
        document.getElementById('modalProjectDescription').textContent = projectData.description.replace(/\\n/g, '<br>');
        document.getElementById('modalStudentName').textContent = projectData.studentName;
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

        const modalPosterLink = document.getElementById('modalPosterLink');
        const modalPdfLink = document.getElementById('modalPdfLink');

        if (projectData.posterUrl) {
            modalPosterLink.href = projectData.posterUrl;
            modalPosterLink.style.display = 'inline-flex';
        } else {
            modalPosterLink.style.display = 'none';
        }

        if (projectData.pdfUrl) {
            modalPdfLink.href = projectData.pdfUrl;
            modalPdfLink.style.display = 'inline-flex';
        } else {
            modalPdfLink.style.display = 'none';
        }

        // Medya görüntüleyici butonlarına tıklama olayları
        document.querySelectorAll('.media-viewer-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                document.getElementById('projectDetailsContent').style.display = 'none';
                document.getElementById('projectMediaContent').style.display = 'block';
                const mediaUrl = this.href;
                document.getElementById('modalMediaViewer').src = mediaUrl;
            };
        });

        // Detaylara geri dön butonu
        document.getElementById('backToDetailsBtn').onclick = function() {
            document.getElementById('projectDetailsContent').style.display = 'flex';
            document.getElementById('projectMediaContent').style.display = 'none';
            document.getElementById('modalMediaViewer').src = ''; // iFrame src'sini temizle
        };

    });

    // --- Projeler için Filtreleme Sistemi ---
    const projectSearchInput = document.getElementById('projectSearchInput');
    const projectCategoryFilter = document.getElementById('projectCategoryFilter');
    const projectSortFilter = document.getElementById('projectSortFilter'); // Yeni sıralama filtresi
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const activeTagFilterDisplay = document.getElementById('activeTagFilterDisplay');
    const currentFilteredTag = document.getElementById('currentFilteredTag');
    const clearTagFilterBtn = document.getElementById('clearTagFilterBtn');

    // Kategorileri doldur
    const categories = [...new Set(projects.map(project => project.category))];
    categories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        projectCategoryFilter.appendChild(option);
    });

    // Filtre olay dinleyicileri
    projectSearchInput.addEventListener('input', filterAndRenderProjects);
    projectCategoryFilter.addEventListener('change', filterAndRenderProjects);
    projectSortFilter.addEventListener('change', filterAndRenderProjects); // Sıralama filtresi dinleyicisi
    resetFiltersBtn.addEventListener('click', () => {
        projectSearchInput.value = '';
        projectCategoryFilter.value = 'all';
        projectSortFilter.value = 'default'; // Sıralama filtresini sıfırla
        selectedTagFilter = null; // Etiket filtresini sıfırla
        filterAndRenderProjects();
    });

    // Etiket filtresini temizleme butonu dinleyicisi
    clearTagFilterBtn.addEventListener('click', () => {
        selectedTagFilter = null;
        filterAndRenderProjects();
    });

    // Tüm projelerle ilk render
    filterAndRenderProjects();

    function updateDateTime() {
        const now = new Date();
        const dateElement = document.querySelector('.datetime-info .date');
        const timeElement = document.getElementById('currentTime');
        
        // Tarih formatını ayarla (GG.AA.YYYY)
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Ay 0-11 arası olduğu için +1
        const year = now.getFullYear();
        
        dateElement.textContent = `TARİH: ${day}.${month}.${year}`;

        // Saat formatını ayarla (HH:MM:SS)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        timeElement.textContent = `SAAT: ${hours}:${minutes}:${seconds}`;
    }

    // Sayfa yüklendiğinde ve her saniyede bir güncelle
    document.addEventListener('DOMContentLoaded', () => {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    });

}); // DOMContentLoaded sonu

// projects global olarak tanımlı olduğu için doğrudan kullanılabilir
// import { projects } from './projects.js'; // Bu satırın zaten mevcut ve doğru olduğundan emin olmalıyız

function renderProjects(projectsToRender) {
    const projectCardsContainer = document.querySelector('#proje-sergisi .project-cards-container');
    if (!projectCardsContainer) return; // Kapsayıcı yoksa çık

    projectCardsContainer.innerHTML = ''; // Mevcut kartları temizle

    if (projectsToRender && projectsToRender.length > 0) {
        projectsToRender.forEach(project => {
            const cardHtml = `
                <div class="project-card" data-project-id="${project.studentNumber}">
                    <img src="${project.projectPhotoUrl || 'assets/project-placeholder.png'}" alt="Proje Resmi" class="project-card-img">
                    <div class="project-card-content">
                        <h5 class="project-title">${project.title}</h5>
                        <p class="project-category-on-card badge bg-info text-dark mb-2">${project.category}</p>
                        <p class="project-student-info">
                            <img src="${project.studentPhotoUrl || 'assets/student-placeholder.png'}" alt="${project.studentName}" class="project-card-student-photo me-2">
                            <span>${project.studentName}</span>
                        </p>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="badge" data-tag="${tag}">${tag}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary project-details-btn" data-bs-toggle="modal" data-bs-target="#projectDetailModal" data-project='${JSON.stringify(project).replace(/'/g, "&apos;")}'>Detayları Gör</button>
                    </div>
                </div>
            `;
            projectCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Etiketlere tıklama olay dinleyicisi ekle
        projectCardsContainer.querySelectorAll('.project-tags .badge').forEach(tagElement => {
            tagElement.addEventListener('click', function() {
                const clickedTag = this.getAttribute('data-tag');
                filterByTag(clickedTag);
            });
        });

    } else {
        projectCardsContainer.innerHTML = '<p class="text-center w-100">Filtreleme kriterlerine uygun proje bulunamadı.</p>';
    }
}

// Etikete göre filtreleme fonksiyonu
function filterByTag(tag) {
    projectSearchInput.value = ''; // Arama kutusunu temizle
    projectCategoryFilter.value = 'all'; // Kategori filtresini sıfırla
    selectedTagFilter = tag.toLowerCase(); // Seçilen etiketi global değişkene ata
    filterAndRenderProjects();
}

// Global değişkeni tanımla
let selectedTagFilter = null;

function filterAndRenderProjects() {
    const searchTerm = projectSearchInput.value.toLowerCase();
    const selectedCategory = projectCategoryFilter.value;
    const selectedSort = projectSortFilter.value; // Seçilen sıralama değeri

    // Aktif etiket filtresini göster/gizle
    if (selectedTagFilter) {
        activeTagFilterDisplay.style.display = 'flex';
        currentFilteredTag.textContent = selectedTagFilter.charAt(0).toUpperCase() + selectedTagFilter.slice(1); // İlk harfi büyüt
    } else {
        activeTagFilterDisplay.style.display = 'none';
        currentFilteredTag.textContent = '';
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearchTerm = project.title.toLowerCase().includes(searchTerm) ||
                                  project.description.toLowerCase().includes(searchTerm) ||
                                  project.studentName.toLowerCase().includes(searchTerm) ||
                                  project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
        
        // Etikete göre filtreleme ekle
        const matchesTag = selectedTagFilter === null || project.tags.some(tag => tag.toLowerCase() === selectedTagFilter);

        return matchesSearchTerm && matchesCategory && matchesTag;
    });

    // Sıralama mantığı
    if (selectedSort !== 'default') {
        filteredProjects.sort((a, b) => {
            let valA, valB;

            switch (selectedSort) {
                case 'title-asc':
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
                    break;
                case 'title-desc':
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
                    break;
                case 'student-asc':
                    valA = a.studentName.toLowerCase();
                    valB = b.studentName.toLowerCase();
                    break;
                case 'student-desc':
                    valA = a.studentName.toLowerCase();
                    valB = b.studentName.toLowerCase();
                    break;
            }

            if (valA < valB) return selectedSort.includes('asc') ? -1 : 1;
            if (valA > valB) return selectedSort.includes('asc') ? 1 : -1;
            return 0;
        });
    }

    renderProjects(filteredProjects);
} 