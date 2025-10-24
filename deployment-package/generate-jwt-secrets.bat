@echo off
echo JWT Secrets Generator for FMRB API
echo ===================================
echo.
echo Generating secure JWT secrets for production use...
echo.

REM Generate secrets using Node.js crypto
for /f "tokens=1,2 delims==" %%a in ('node -e "const crypto = require('crypto'); console.log('JWT_ACCESS_SECRET=' + crypto.randomBytes(32).toString('hex')); console.log('JWT_REFRESH_SECRET=' + crypto.randomBytes(32).toString('hex'));"') do (
    if "%%a"=="JWT_ACCESS_SECRET" set ACCESS_SECRET=%%b
    if "%%a"=="JWT_REFRESH_SECRET" set REFRESH_SECRET=%%b
)

echo Generated JWT Secrets:
echo ======================
echo JWT_ACCESS_SECRET=%ACCESS_SECRET%
echo JWT_REFRESH_SECRET=%REFRESH_SECRET%
echo.
echo IMPORTANT: These secrets are for production use only!
echo - Each secret is 64 characters long (meets 32+ requirement)
echo - Never share these secrets
echo - Keep them secure and backed up
echo.
echo To use these secrets:
echo 1. Copy the values above
echo 2. Open your .env file in the application directory
echo 3. Replace the JWT_ACCESS_SECRET and JWT_REFRESH_SECRET values
echo 4. Save the file and restart your application
echo.
echo Example .env content:
echo JWT_ACCESS_SECRET=%ACCESS_SECRET%
echo JWT_REFRESH_SECRET=%REFRESH_SECRET%
echo.
pause