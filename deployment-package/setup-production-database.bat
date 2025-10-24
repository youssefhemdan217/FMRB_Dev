@echo off
echo Setting up FMRB Database for Production...
echo.

REM Set environment variables
set NODE_ENV=production
set DB_ENVIRONMENT=production

echo Environment set to production
echo Running database setup...

REM Check if setup-database.js exists in dist folder
if exist "dist\setup-database.js" (
    node dist\setup-database.js
) else (
    echo Compiling and running setup-database.ts...
    npx tsc setup-database.ts --outDir . --target es2020 --module commonjs --esModuleInterop --resolveJsonModule
    node setup-database.js
)

echo.
echo Database setup complete!
pause