// Ders programı verilerini içe aktar
import { courseSchedule, academicTerms } from './schedule.js';

class ScheduleManager {
    constructor() {
        this.currentDay = this.getCurrentDay();
        this.currentClass = 1;
        this.currentTerm = this.getCurrentTerm();
        this.currentWeek = this.getCurrentWeek();
        
        this.courseCardsContainer = document.querySelector('.course-cards-container');
        this.currentTimeElement = document.getElementById('currentTime');
        this.currentCourseElement = document.getElementById('currentCourse');
        this.currentWeekElement = document.getElementById('currentWeek');
        this.activeClassBoxes = document.querySelectorAll('.active-class-box');
        
        this.dayButtons = document.querySelectorAll('.day-btn');
        this.classButtons = document.querySelectorAll('.class-btn');
        this.termButtons = document.querySelectorAll('.term-btn');
        
        this.initEventListeners();
        this.updateCurrentTime();
        this.updateActiveCourses();
        this.renderSchedule();
        this.updateDayButtons(); // Sayfa yüklendiğinde doğru günü aktif yap
        
        // Her dakika güncelle
        setInterval(() => {
            this.updateCurrentTime();
            this.updateActiveCourses();
            this.renderSchedule();
        }, 60000);
    }

    getCurrentDay() {
        const days = ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA'];
        const today = new Date().getDay(); // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
        const dayName = days[today - 1];
        console.log('Current Day (raw): ', today, 'Mapped Day: ', dayName);
        return dayName; // Hafta sonu ise undefined dönecek
    }

    getCurrentTerm() {
        const now = new Date();
        const currentTerm = academicTerms.find(term => {
            const [startDay, startMonth, startYear] = term.start.split('.').map(Number);
            const [endDay, endMonth, endYear] = term.end.split('.').map(Number);
            
            const termStart = new Date(startYear, startMonth - 1, startDay);
            const termEnd = new Date(endYear, endMonth - 1, endDay);
            
            return now >= termStart && now <= termEnd;
        });

        console.log('Current Term: ', currentTerm ? currentTerm.term : 'bahar');
        return currentTerm ? currentTerm.term : 'bahar';
    }

    getCurrentWeek() {
        const now = new Date();
        const currentTerm = academicTerms.find(term => term.term === this.currentTerm);
        
        if (!currentTerm) return 1;

        const [startDay, startMonth, startYear] = currentTerm.start.split('.').map(Number);
        const termStart = new Date(startYear, startMonth - 1, startDay);
        
        const diffTime = Math.abs(now - termStart);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const week = Math.ceil(diffDays / 7);
        console.log('Current Week: ', week);
        return week;
    }

    initEventListeners() {
        // Gün seçici
        this.dayButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.dayButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentDay = button.dataset.day;
                console.log('Day changed to: ', this.currentDay);
                this.renderSchedule();
            });
        });

        // Sınıf seçici
        this.classButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.classButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentClass = parseInt(button.dataset.class);
                console.log('Class changed to: ', this.currentClass);
                this.renderSchedule();
            });
        });

        // Dönem seçici
        this.termButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.termButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.currentTerm = button.dataset.term;
                this.currentWeek = this.getCurrentWeek();
                console.log('Term changed to: ', this.currentTerm);
                this.renderSchedule();
            });
        });

        // Dokunmatik kaydırma desteği
        let touchStartX = 0;
        let touchEndX = 0;
        const container = this.courseCardsContainer;
        
        container.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        container.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const days = ['PAZARTESİ', 'SALI', 'ÇARŞAMBA', 'PERŞEMBE', 'CUMA'];
        const currentIndex = days.indexOf(this.currentDay);
        
        if (startX - endX > 50) { // Sola kaydırma
            if (currentIndex < days.length - 1) {
                this.currentDay = days[currentIndex + 1];
                this.updateDayButtons();
                this.renderSchedule();
                console.log('Swiped left to: ', this.currentDay);
            }
        } else if (endX - startX > 50) { // Sağa kaydırma
            if (currentIndex > 0) {
                this.currentDay = days[currentIndex - 1];
                this.updateDayButtons();
                this.renderSchedule();
                console.log('Swiped right to: ', this.currentDay);
            }
        }
    }

    updateDayButtons() {
        let targetDay = this.currentDay; // Varsayılan olarak mevcut gün
        const now = new Date();
        const dayOfWeek = now.getDay();

        // Eğer currentDay tanımsızsa (hafta sonuysa), Pazartesi'yi aktif yap
        if (!targetDay || dayOfWeek === 0 || dayOfWeek === 6) {
            targetDay = 'PAZARTESİ';
            this.currentDay = 'PAZARTESİ'; // currentDay'i de güncelle
        }

        this.dayButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.day === targetDay);
        });
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
        this.currentTimeElement.textContent = timeString;
    }

    updateCurrentWeek() {
        this.currentWeekElement.textContent = `${this.currentWeek}. Hafta`;
    }

    updateActiveCourses() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDay = this.getCurrentDay();
        
        // Hafta sonu veya gün ders günü değilse aktif dersleri boşalt
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        console.log('Is Weekend (for active courses): ', isWeekend, 'Current Day: ', currentDay);
        
        this.activeClassBoxes.forEach(box => {
            const classNumber = parseInt(box.dataset.class);
            const activeCourseElement = box.querySelector('.active-course');
            
            if (isWeekend || !currentDay) { // Eğer hafta sonuysa veya gün belirlenemiyorsa
                activeCourseElement.textContent = 'Ders bulunmamaktadır';
                activeCourseElement.classList.remove('has-course');
                return;
            }
            
            const activeCourse = courseSchedule.find(course => {
                if (course.day !== currentDay || 
                    course.year !== classNumber || 
                    course.term !== this.currentTerm) return false;
                
                const [startHour, startMin] = course.time.split('-')[0].trim().split(':').map(Number);
                const [endHour, endMin] = course.time.split('-')[1].trim().split(':').map(Number);
                
                const startTime = startHour * 60 + startMin;
                const endTime = endHour * 60 + endMin;
                
                return currentTime >= startTime && currentTime <= endTime;
            });
            
            if (activeCourse) {
                activeCourseElement.innerHTML = `
                    <div>
                        <strong>${activeCourse.time}</strong><br>
                        ${activeCourse.name}<br>
                        <small>${activeCourse.room}</small>
                    </div>
                `;
                activeCourseElement.classList.add('has-course');
            } else {
                activeCourseElement.textContent = 'Ders bulunmamaktadır';
                activeCourseElement.classList.remove('has-course');
            }
        });
    }

    renderSchedule() {
        this.courseCardsContainer.innerHTML = '';
        
        // Hafta bilgisini güncelle
        this.updateCurrentWeek();
        
        // Eğer currentDay undefined ise (hafta sonu vb.) Pazartesi'yi göster
        let displayDay = this.currentDay || 'PAZARTESİ';
        console.log('Render Schedule - Display Day: ', displayDay, 'Current Class: ', this.currentClass, 'Current Term: ', this.currentTerm);
        
        // Seçili gün, sınıf ve döneme göre dersleri filtrele
        const dayCourses = courseSchedule
            .filter(course => {
                const match = course.day === displayDay && 
                              course.year === this.currentClass &&
                              course.term === this.currentTerm;
                console.log(`Filtering: Day ${course.day}==${displayDay}, Year ${course.year}==${this.currentClass}, Term ${course.term}==${this.currentTerm} -> ${match}`);
                return match;
            })
            .sort((a, b) => {
                const [aHour] = a.time.split('-')[0].trim().split(':').map(Number);
                const [bHour] = b.time.split('-')[0].trim().split(':').map(Number);
                return aHour - bHour;
            });

        console.log('Filtered Courses Count: ', dayCourses.length, 'Courses: ', dayCourses);

        if (dayCourses.length === 0) {
            this.courseCardsContainer.innerHTML = `
                <div class="text-center p-4">
                    <p class="text-muted">Bu gün için ders bulunmamaktadır.</p>
                </div>
            `;
            return;
        }

        dayCourses.forEach(course => {
            const card = this.createCourseCard(course);
            this.courseCardsContainer.appendChild(card);
        });
    }

    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = `course-card ${course.room.toLowerCase().includes('online') ? 'online' : 'face-to-face'}`;
        
        // Ders durumunu kontrol et
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const currentDayOfWeek = now.getDay(); // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
        const currentDayName = this.getCurrentDay(); // undefined olabilir hafta sonu

        const [startHour, startMin] = course.time.split('-')[0].trim().split(':').map(Number);
        const [endHour, endMin] = course.time.split('-')[1].trim().split(':').map(Number);
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;
        
        let status = 'future';
        
        // Eğer dersin günü şu anki günse ve hafta içi ise
        if (course.day === currentDayName && currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
            if (currentTime >= startTime && currentTime <= endTime) {
                status = 'current';
                card.classList.add('current');
            } else if (currentTime > endTime) {
                status = 'past';
                card.classList.add('past');
            } else {
                card.classList.add('future');
            }
        } else { // Hafta sonu veya ders başka bir günse her zaman gelecek olarak göster
            status = 'future';
            card.classList.add('future');
        }

        card.innerHTML = `
            <div class="course-time">${course.time}</div>
            <div class="course-content">
                <div class="course-name">${course.name}</div>
                <div class="course-info">
                    <div class="course-instructor">${course.instructor}</div>
                    <div class="course-room">
                        <i class="fas fa-${course.room.toLowerCase().includes('online') ? 'video' : 'chalkboard'}"></i>
                        ${course.room}
                    </div>
                </div>
            </div>
            <div class="course-code">${course.code}</div>
            <div class="course-status ${status}">
                ${status === 'current' ? 'Devam Ediyor' : 
                  status === 'past' ? 'Tamamlandı' : 'Başlayacak'}
            </div>
        `;

        return card;
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    new ScheduleManager();
}); 