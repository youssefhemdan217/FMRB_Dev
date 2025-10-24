@echo off
echo Starting FMRB API in production mode...

REM Set environment to production
set NODE_ENV=production
set DB_ENVIRONMENT=production

REM Load environment variables from production file
if exist .env.production (
    echo Loading production environment variables...
    for /f "delims=" %%x in (.env.production) do (set "%%x")
)

REM Start the application
echo Starting Node.js application...
node dist/index.js

pause