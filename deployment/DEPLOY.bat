@echo off
echo ========================================
echo FMRB API Deployment Package Creator
echo ========================================

echo.
echo 1. Installing production dependencies...
cd /d "%~dp0"
call npm install --only=production

echo.
echo 2. Deployment package ready!
echo.
echo Files included:
echo - index.js (main application)
echo - All compiled JavaScript files
echo - package.json (production dependencies only)
echo - web.config (IIS configuration)
echo - .env (environment variables)
echo - node_modules (production dependencies)
echo.
echo ========================================
echo DEPLOYMENT INSTRUCTIONS:
echo ========================================
echo 1. Copy this entire folder to your IIS server
echo 2. Place it in: C:\inetpub\wwwroot\MeetingBookingApi\
echo 3. Ensure IISNode is installed on the server
echo 4. Create a new IIS site pointing to this folder
echo 5. Set the application pool to No Managed Code
echo ========================================
echo.
pause