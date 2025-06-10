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