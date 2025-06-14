@echo off
REM GitHub Pages URL'sini buraya yazın
set GITHUB_URL=https://canmars.github.io/kiosk

REM Chrome'u kiosk modunda başlat
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "%GITHUB_URL%" --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI --disable-features=Translate

REM 5 dakikada bir sayfayı yenile
:loop
timeout /t 300 /nobreak
taskkill /F /IM chrome.exe
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "%GITHUB_URL%" --disable-pinch --overscroll-history-navigation=0 --disable-features=TranslateUI --disable-features=Translate
goto loop 