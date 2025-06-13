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