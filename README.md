# DEU Proje Sergisi Kiosk Uygulaması

Bu uygulama, DEU Proje Sergisi web sitesini kiosk modunda görüntülemek için tasarlanmıştır.

## Çalıştırma Yöntemleri

### 1. Batch (.bat) Dosyası ile Çalıştırma

1. `start-kiosk-github.bat` dosyasını düzenleyin:
   - GitHub Pages URL'sini kendi repository URL'niz ile değiştirin
   - `set GITHUB_URL=https://kullaniciadi.github.io/deu-kiosk`

2. Windows'ta otomatik başlatma için:
   - Windows + R tuşlarına basın
   - `shell:startup` yazıp Enter'a basın
   - `.bat` dosyasını bu klasöre kopyalayın

3. Uygulamayı başlatmak için:
   - `.bat` dosyasına çift tıklayın
   - veya
   - Bilgisayarı yeniden başlatın (otomatik başlatma ayarlandıysa)

### 2. Node.js ile Çalıştırma

1. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```

2. Uygulamayı başlatın:
   ```bash
   npm run kiosk
   ```

3. Windows'ta otomatik başlatma için:
   - Windows + R tuşlarına basın
   - `shell:startup` yazıp Enter'a basın
   - Yeni bir kısayol oluşturun:
     - "Öğenin konumu": `cmd.exe`
     - "Başlangıç konumu": `C:\Users\[KullanıcıAdı]\OneDrive\Masaüstü\kiosk`
     - "Komut": `/k npm run kiosk`

### 3. Python Sunucusu ile Çalıştırma

1. Python'u yükleyin (eğer yüklü değilse)

2. Terminal/Komut İstemcisinde proje klasörüne gidin ve şu komutu çalıştırın:
   ```bash
   python -m http.server 8000
   ```

3. Chrome'u kiosk modunda başlatın:
   ```bash
   start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://localhost:8000" --disable-pinch --overscroll-history-navigation=0
   ```

## Özellikler

- Tam ekran kiosk modu
- F11 tuşu ile kiosk modundan çıkış
- Otomatik başlangıç desteği
- 5 dakikada bir otomatik yenileme
- Dokunmatik ekran desteği

## Geliştirme

Uygulamayı geliştirmek için:

```bash
npm install
npm start
```

## Derleme

Windows için taşınabilir uygulama oluşturmak için:

```bash
npm run build
```

Derlenen uygulama `dist` klasöründe bulunacaktır.

## Önemli Notlar

1. **Güvenlik Ayarları:**
   - Windows Defender'da Chrome'u güvenilir uygulamalar listesine ekleyin
   - Güvenlik duvarı ayarlarını kontrol edin

2. **Windows Ayarları:**
   - "Güç ve uyku" ayarlarını "Hiçbir zaman" yapın
   - "Ekran koruyucu" ayarlarını kapatın
   - Windows güncellemelerini devre dışı bırakın

3. **Sorun Giderme:**
   - Kiosk modundan çıkmak için: Alt + F4
   - Chrome'u yeniden başlatmak için: Ctrl + Shift + R
   - İnternet bağlantısı kontrolü için: Windows + I > Ağ ve İnternet 