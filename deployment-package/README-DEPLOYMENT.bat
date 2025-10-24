@echo off
echo FMRB API Server Deployment Package
echo ================================
echo.
echo This package contains all files needed to deploy the FMRB API to IIS.
echo.
echo IMPORTANT: Before deployment, ensure:
echo 1. Node.js is installed on the target server
echo 2. IISNode module is installed
echo 3. MySQL database server is accessible
echo 4. Update JWT secrets in .env file
echo.
echo Files included:
echo - dist/          : Compiled JavaScript application
echo - node_modules/  : Dependencies
echo - database/      : Database scripts
echo - package.json   : Package configuration
echo - web.config     : IIS configuration
echo - .env           : Production environment variables
echo - setup-database.ts : Database setup script
echo.
echo Next steps:
echo 1. Copy all files to your IIS server directory (e.g., C:\inetpub\wwwroot\fmrb-api)
echo 2. Follow the IIS_DEPLOYMENT_GUIDE.md for detailed setup instructions
echo 3. Configure IIS application and application pool
echo 4. Setup database using: node setup-database.js
echo.
echo For detailed instructions, see: IIS_DEPLOYMENT_GUIDE.md
echo.
pause