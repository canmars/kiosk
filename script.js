document.addEventListener('DOMContentLoaded', function() {
    // Menü butonları için event listener
    const menuButtons = document.querySelectorAll('.menu-btn');
    const contentPages = document.querySelectorAll('.content-page');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif menü butonunu güncelle
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // İlgili içerik sayfasını göster
            const targetPage = button.getAttribute('data-page');
            contentPages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
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

    // Otomatik sayfa yenileme (her 5 dakikada bir)
    setInterval(() => {
        const activePage = document.querySelector('.content-page.active');
        if (activePage.id === 'proje-sergisi') {
            const iframe = activePage.querySelector('iframe');
            if (iframe) {
                iframe.src = iframe.src;
            }
        }
    }, 300000); // 5 dakika
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