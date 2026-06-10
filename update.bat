@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ===========================================
echo   萧和和个人网站 - 一键更新脚本
echo ===========================================
echo.
echo [1/2] 更新 Bangumi 追番数据...
node fetch_bangumi.js
if %errorlevel% neq 0 (
    echo [!] Bangumi 更新失败（网络可能不通），继续...
)
echo.
echo [2/2] 扫描音乐文件夹并更新播放列表...
node update.js
echo.
echo ===========================================
echo   更新完成！刷新浏览器即可看到最新内容
echo ===========================================
pause
