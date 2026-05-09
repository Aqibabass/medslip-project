@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
echo Node.js and npm are now available in this window.
echo Running from: %CD%
echo.
echo Available commands:
echo   npm run dev    - Start dev server
echo   npm run build  - Build for production
echo.
npm run dev