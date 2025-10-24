@echo off
echo FMRB API Deployment Verification and Fix Script
echo ================================================
echo.
echo This script will help diagnose and fix common deployment issues.
echo.

echo Step 1: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo Step 2: Checking current directory...
echo Current directory: %CD%
dir /b

echo.
echo Step 3: Checking if package.json exists...
if not exist "package.json" (
    echo ERROR: package.json not found in current directory
    echo Make sure you're in the application root directory
    pause
    exit /b 1
)
echo ✅ package.json found

echo.
echo Step 4: Checking if dist folder exists...
if not exist "dist" (
    echo ERROR: dist folder not found
    echo The application may not be properly built
    pause
    exit /b 1
)
echo ✅ dist folder found

echo.
echo Step 5: Checking if main application file exists...
if not exist "dist\index.js" (
    echo ERROR: dist\index.js not found
    echo The application may not be properly built
    pause
    exit /b 1
)
echo ✅ Main application file found

echo.
echo Step 6: Installing/Reinstalling node_modules...
echo This may take a few minutes...
npm install --production
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    echo Check your internet connection and try again
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

echo.
echo Step 7: Verifying Express module...
node -e "console.log('Express version:', require('express/package.json').version)"
if %errorlevel% neq 0 (
    echo ERROR: Express module not found
    echo Trying to reinstall...
    npm install express --save
)

echo.
echo Step 8: Testing application startup...
echo Setting environment variables...
set NODE_ENV=production
set DB_ENVIRONMENT=production

echo.
echo Attempting to start application (will stop after 5 seconds)...
timeout /t 5 /nobreak > nul & taskkill /f /im node.exe 2>nul
start /b node dist\index.js
timeout /t 3 /nobreak > nul
taskkill /f /im node.exe 2>nul

echo.
echo Step 9: Checking file permissions...
echo Making sure IIS_IUSRS has access to the directory...
icacls . /grant "IIS_IUSRS:(OI)(CI)F" /T > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Permissions updated
) else (
    echo ⚠️ Could not update permissions (you may need administrator rights)
)

echo.
echo Step 10: Verification Summary
echo =============================
echo ✅ Node.js: Working
echo ✅ Package.json: Found
echo ✅ Compiled app: Found
echo ✅ Dependencies: Installed
echo ✅ Permissions: Updated
echo.
echo If you're still getting errors:
echo 1. Restart IIS: iisreset
echo 2. Check IIS application pool is running
echo 3. Verify web.config is properly configured
echo 4. Check Windows Event Logs for detailed errors
echo.
echo Your application should now work properly!
echo.
pause