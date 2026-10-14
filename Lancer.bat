@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js est introuvable. Installez-le depuis https://nodejs.org puis relancez ce fichier.
  pause
  exit /b 1
)
echo Demarrage du relais... laissez cette fenetre ouverte.
rem ouvre le navigateur apres 2 secondes, le temps que le relais demarre
start "" /b cmd /c "timeout /t 2 >nul & start http://127.0.0.1:4317"
node relay\server.js
pause
