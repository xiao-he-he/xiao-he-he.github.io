@echo off
cd /d "%~dp0"
echo ===========================================
echo   XiaoHehe Website - Update Script
echo ===========================================
echo.
echo [1/2] Updating Bangumi data...
node fetch_bangumi.js
if %errorlevel% neq 0 (
    echo [!] Bangumi update failed, skipping...
)
echo.
echo [2/2] Scanning music folder...
node update.js
echo.
echo ===========================================
echo   Done! Refresh your browser.
echo ===========================================
pause
