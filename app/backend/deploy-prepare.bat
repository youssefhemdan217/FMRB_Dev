@echo off
echo Building and deploying FMRB API...

REM Install dependencies
echo Installing dependencies...
npm install

REM Build the application
echo Building TypeScript...
npm run build

REM Setup production database
echo Setting up production database...
set DB_ENVIRONMENT=production
node dist/setup-database.js

echo Deployment preparation complete!
echo You can now copy the following files to your IIS server:
echo - dist/ folder
echo - node_modules/ folder
echo - package.json
echo - web.config
echo - .env.production
echo.
echo Make sure to:
echo 1. Install Node.js on the server
echo 2. Install iisnode module for IIS
echo 3. Configure IIS application
echo.
pause