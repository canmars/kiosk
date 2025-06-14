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
    const projectCardsContainer = document.querySelector('#proje-sergisi .project-cards-container');
    const projectDetailModal = new bootstrap.Modal(document.getElementById('projectDetailModal'));

    if (typeof projects !== 'undefined' && projects.length > 0) {
        projects.forEach(project => {
            const cardHtml = `
                <div class="col-md-4 mb-4">
                    <div class="card project-card" data-project-id="${project.studentNumber}">
                        <img src="${project.projectPhotoUrl || 'assets/project-placeholder.png'}" class="card-img-top" alt="Proje Resmi">
                        <div class="card-body">
                            <h5 class="card-title">${project.title}</h5>
                            <p class="card-text">${project.studentName} (${project.studentNumber})</p>
                            <button class="btn btn-sm btn-primary view-details-btn" data-bs-toggle="modal" data-bs-target="#projectDetailModal" data-project='${JSON.stringify(project).replace(/'/g, "&apos;")}'>Detayları Gör</button>
                        </div>
                    </div>
                </div>
            `;
            projectCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Detayları Gör butonlarına click listener ekle
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const projectData = JSON.parse(this.getAttribute('data-project').replace(/&apos;/g, "'"));
                
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
                    span.className = 'badge bg-secondary';
                    span.textContent = tag;
                    tagsContainer.appendChild(span);
                });

                document.getElementById('modalPosterLink').href = projectData.posterUrl || '#';
                document.getElementById('modalPdfLink').href = projectData.pdfUrl || '#';

                projectDetailModal.show();
            });
        });
    } else {
        projectCardsContainer.innerHTML = '<p class="text-center w-100">Proje verileri yüklenemedi veya bulunamadı.</p>';
    }
});

// Ders Programı Fonksiyonları
function createCourseCard(course) {
    return `
        <div class="course-card">
            <div class="course-code">${course.code}</div>
            <div class="course-name">${course.name}</div>
            <div class="course-info">${course.instructor}</div>
            <div class="course-room">${course.room}</div>
        </div>
    `;
}

function getCurrentWeek(termObj) {
    // Bugünün tarihi
    const today = new Date();
    // Başlangıç tarihi
    const [d, m, y] = termObj.start.split('.');
    const start = new Date(`${y}-${m}-${d}`);
    // Kaç hafta geçti?
    const diff = today - start;
    if (diff < 0) return 1;
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return week;
}

function updateTermInfo(term, year) {
    const infoDiv = document.getElementById('termInfo');
    const termObj = academicTerms.find(t => t.term === term);
    if (!termObj) { infoDiv.innerHTML = ''; return; }
    const week = getCurrentWeek(termObj);
    infoDiv.innerHTML = `
      <span><span class="icon">📅</span><b>Dönem:</b> ${termObj.name}</span>
      <span><span class="icon">🗓️</span><b>Dersler:</b> ${termObj.start} - ${termObj.end}</span>
      <span><span class="icon">⏰</span><b>Hafta:</b> ${week}</span>
      <span><span class="icon">👤</span><b>Sınıf:</b> ${year}. Sınıf</span>
    `;
}

function isTimeOverlap(slot, courseTime) {
    const [slotStart, slotEnd] = slot.split('-');
    const [courseStart, courseEnd] = courseTime.split('-');
    const toNum = t => parseInt(t.replace(':', ''));
    return toNum(slotStart) === toNum(courseStart) && toNum(slotEnd) === toNum(courseEnd);
}

function updateSchedule(term, year) {
    const scheduleBody = document.getElementById('scheduleBody');
    const courses = courseSchedule.filter(course => String(course.year) === String(year) && course.term === term);
    const timeSlots = [
        '08:30-09:15',
        '09:25-10:10',
        '10:20-11:05',
        '11:15-12:00',
        '13:00-13:45',
        '13:55-14:40',
        '14:50-15:35',
        '15:45-16:30'
    ];
    const days = ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA'];
    let scheduleHTML = '';
    timeSlots.forEach(timeSlot => {
        scheduleHTML += '<tr>';
        scheduleHTML += `<td class="text-center align-middle">${timeSlot}</td>`;
        days.forEach(day => {
            const dayCourses = courses.filter(course =>
                course.day === day && isTimeOverlap(timeSlot, course.time)
            );
            scheduleHTML += '<td>';
            if (dayCourses.length > 0) {
                dayCourses.forEach(course => {
                    scheduleHTML += `
                        <div class="course-card">
                            <div class="course-name">${course.name}</div>
                            <div class="course-code">${course.code}</div>
                            <div class="course-info">${course.instructor}</div>
                            <div class="course-room">${course.room}</div>
                        </div>
                    `;
                });
            } else {
                scheduleHTML += `<div class='empty-slot'>Ders Yok</div>`;
            }
            scheduleHTML += '</td>';
        });
        scheduleHTML += '</tr>';
    });
    scheduleBody.innerHTML = scheduleHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const termSelect = document.getElementById('termSelect');
    const yearSelect = document.getElementById('yearSelect');
    function updateAll() {
        updateTermInfo(termSelect.value, yearSelect.value);
        updateSchedule(termSelect.value, yearSelect.value);
    }
    updateAll();
    termSelect.addEventListener('change', updateAll);
    yearSelect.addEventListener('change', updateAll);
}); 