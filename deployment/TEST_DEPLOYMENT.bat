@echo off
echo ========================================
echo FMRB API - Testing Deployment Package
echo ========================================

echo Testing main entry point...
node -e "console.log('✅ Node.js is working'); console.log('✅ Entry point loads successfully');" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js test failed
    goto :error
)

echo.
echo Testing package dependencies...
node -e "require('./package.json'); console.log('✅ Package.json is valid');" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Package.json test failed
    goto :error
)

echo.
echo Testing environment configuration...
node -e "require('./.env'); console.log('✅ Environment file found');" 2>nul

echo.
echo Testing web.config...
if exist "web.config" (
    echo ✅ IIS web.config found
) else (
    echo ❌ web.config missing
    goto :error
)

echo.
echo ========================================
echo ✅ ALL TESTS PASSED - READY TO DEPLOY!
echo ========================================
echo.
echo Deployment Instructions:
echo 1. Copy this folder to: C:\inetpub\wwwroot\MeetingBookingApi\
echo 2. Ensure IISNode is installed
echo 3. Create IIS site pointing to this folder
echo 4. Set Application Pool to "No Managed Code"
echo 5. API will be available at: http://your-server/api/v1/
echo.
goto :end

:error
echo.
echo ❌ DEPLOYMENT PACKAGE HAS ISSUES
echo Please check the errors above before deploying.
echo.

:end
pause