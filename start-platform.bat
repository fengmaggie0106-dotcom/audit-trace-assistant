@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-platform.ps1"
if errorlevel 1 (
  echo.
  echo Startup failed. Please review the message above.
  pause
)
