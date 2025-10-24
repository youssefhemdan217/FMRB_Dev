# FMRB API Deployment Guide - IIS Server

This guide provides step-by-step instructions for deploying the FMRB Node.js API application to an IIS server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Preparation](#server-preparation)
3. [Application Preparation](#application-preparation)
4. [IIS Configuration](#iis-configuration)
5. [Database Setup](#database-setup)
6. [Deployment Steps](#deployment-steps)
7. [Testing and Verification](#testing-and-verification)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

## Prerequisites

### On Development Machine
- ✅ Node.js (v18 or higher)
- ✅ npm or yarn package manager
- ✅ Git (for version control)
- ✅ Access to the source code

### On Target Server (SPMWSM02X3ZD.saipemnet.saipem.intranet)
- ✅ Windows Server with IIS installed
- ✅ Node.js (v18 or higher) installed
- ✅ IISNode module installed
- ✅ MySQL Server access
- ✅ Administrative privileges

## Server Preparation

### 1. Install Node.js on Server
```bash
# Download and install Node.js LTS from https://nodejs.org/
# Verify installation
node --version
npm --version
```

### 2. Install IISNode Module
1. Download IISNode from: https://github.com/Azure/iisnode/releases
2. Run the installer: `iisnode-full-v0.2.26-x64.msi` (or latest version)
3. Restart IIS after installation:
   ```cmd
   iisreset
   ```

### 3. Enable Required IIS Features
Open PowerShell as Administrator and run:
```powershell
# Enable IIS features
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServer
Enable-WindowsOptionalFeature -Online -FeatureName IIS-CommonHttpFeatures
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpErrors
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpLogging
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ISAPIExtensions
Enable-WindowsOptionalFeature -Online -FeatureName IIS-ISAPIFilter
Enable-WindowsOptionalFeature -Online -FeatureName IIS-RequestFiltering
Enable-WindowsOptionalFeature -Online -FeatureName IIS-StaticContent
Enable-WindowsOptionalFeature -Online -FeatureName IIS-HttpRedirect
```

## Application Preparation

### 1. Build the Application (On Development Machine)

```bash
# Navigate to backend directory
cd d:\Saipem\FMB\FMRB_Dev\app\backend

# Install dependencies
npm install

# Run deployment preparation script
npm run deploy-prepare.bat

# Or manually:
# Build TypeScript
npm run build

# The dist/ folder will contain the compiled JavaScript
```

### 2. Prepare Environment Configuration

#### Update `.env.production` file:
```env
# Production Environment
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1

# Database Configuration
DB_ENVIRONMENT=production

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your-super-secure-production-access-secret-key-32-chars-minimum-change-this-now
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret-key-32-chars-minimum-change-this-now

# CORS (Update with your frontend URL)
CORS_ORIGIN=http://your-frontend-domain.saipemnet.saipem.intranet
```

**⚠️ IMPORTANT:** Change the JWT secrets to strong, unique values!

### 3. Files to Deploy
Prepare the following files/folders for deployment:
- `dist/` (compiled JavaScript)
- `node_modules/` (dependencies)
- `package.json`
- `web.config`
- `.env.production`
- Database scripts in `database/` folder

## IIS Configuration

### 1. Create Application Pool
1. Open **IIS Manager**
2. Right-click **Application Pools** → **Add Application Pool**
3. Configure:
   - **Name:** `FMRB_API_Pool`
   - **.NET CLR Version:** `No Managed Code`
   - **Managed Pipeline Mode:** `Integrated`
   - **Start application pool immediately:** ✅

### 2. Configure Application Pool Identity
1. Right-click `FMRB_API_Pool` → **Advanced Settings**
2. Set **Identity** to `ApplicationPoolIdentity`
3. Set **Load User Profile** to `True`
4. Set **Idle Time-out (minutes)** to `0` (disable timeout)

### 3. Create IIS Application
1. Right-click **Default Web Site** → **Add Application**
2. Configure:
   - **Alias:** `fmrb-api`
   - **Application Pool:** `FMRB_API_Pool`
   - **Physical Path:** `C:\inetpub\wwwroot\fmrb-api` (or your chosen path)

### 4. Set Application Permissions
```cmd
# Grant IIS_IUSRS permissions to the application directory
icacls "C:\inetpub\wwwroot\fmrb-api" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

## Database Setup

### 1. Verify Database Connection
Ensure the production database server is accessible:
- **Server:** `SPMWSM02X3ZD.saipemnet.saipem.intranet:3306`
- **Database:** `fmrb_db`
- **User:** `user`
- **Password:** `Fabsi@1234`

### 2. Test Database Connection
```bash
# From the server, test MySQL connection
mysql -h SPMWSM02X3ZD.saipemnet.saipem.intranet -P 3306 -u user -p
# Enter password: Fabsi@1234
```

### 3. Setup Database Schema
On the server, navigate to your application directory and run:
```cmd
# Set environment to production
set DB_ENVIRONMENT=production
set NODE_ENV=production

# Run database setup
node dist/setup-database.js
```

## Deployment Steps

### Step 1: Copy Files to Server
1. Create directory: `C:\inetpub\wwwroot\fmrb-api`
2. Copy the following from your development machine:
   ```
   fmrb-api/
   ├── dist/          # Compiled JavaScript files
   ├── node_modules/  # Dependencies
   ├── database/      # Database scripts
   ├── package.json
   ├── web.config
   └── .env.production
   ```

### Step 2: Install Dependencies (if not copied)
```cmd
cd C:\inetpub\wwwroot\fmrb-api
npm install --production
```

### Step 3: Set Environment Variables
1. Rename `.env.production` to `.env`
2. Verify the configuration is correct

### Step 4: Setup Database
```cmd
cd C:\inetpub\wwwroot\fmrb-api
set DB_ENVIRONMENT=production
node dist/setup-database.js
```

### Step 5: Start Application
1. In IIS Manager, right-click your application → **Manage Application** → **Browse**
2. The application should start automatically

## Testing and Verification

### 1. Test API Endpoints
```bash
# Test health endpoint
curl http://your-server/fmrb-api/api/v1/health

# Test authentication endpoint
curl -X POST http://your-server/fmrb-api/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Check Logs
- **IIS Logs:** `C:\inetpub\logs\LogFiles\W3SVC1\`
- **IISNode Logs:** `C:\inetpub\wwwroot\fmrb-api\iisnode\`
- **Application Logs:** Check console output in IISNode logs

### 3. Monitor Performance
- Use IIS Manager to monitor application pool performance
- Check Windows Performance Monitor for Node.js processes

## Troubleshooting

### Common Issues

#### 1. **500 Internal Server Error**
- Check IISNode logs in `iisnode/` folder
- Verify `web.config` syntax
- Ensure Node.js is properly installed

#### 2. **Database Connection Failed**
- Verify network connectivity to database server
- Check firewall settings
- Validate database credentials

#### 3. **Module Not Found Errors**
- Ensure `node_modules` is properly copied
- Run `npm install` in the application directory
- Check file permissions

#### 4. **Environment Variables Not Loading**
- Verify `.env` file is in the root directory
- Check file permissions
- Ensure environment variables are properly formatted

### Debug Commands
```cmd
# Check Node.js installation
node --version

# Test application manually
cd C:\inetpub\wwwroot\fmrb-api
set NODE_ENV=production
set DB_ENVIRONMENT=production
node dist/index.js

# Check IIS configuration
%systemroot%\system32\inetsrv\appcmd list app
```

## Maintenance

### 1. Updates and Deployments
1. Build new version on development machine
2. Stop IIS application: `Right-click app → Manage Application → Stop`
3. Replace `dist/` folder and `package.json`
4. Update dependencies if needed: `npm install`
5. Restart application: `Right-click app → Manage Application → Start`

### 2. Log Management
- Regularly clean IIS logs: `C:\inetpub\logs\LogFiles\`
- Archive IISNode logs: `C:\inetpub\wwwroot\fmrb-api\iisnode\`
- Monitor disk space usage

### 3. Database Maintenance
- Regular backups of `fmrb_db`
- Monitor database performance
- Update credentials as needed

### 4. Security Updates
- Keep Node.js updated
- Update npm packages regularly: `npm audit fix`
- Review and rotate JWT secrets periodically

## Environment Switching

To switch between local and production databases, update the `.env` file:

```env
# For local database
DB_ENVIRONMENT=local

# For production database
DB_ENVIRONMENT=production
```

Then restart the IIS application.

## Support Contacts

- **Development Team:** [Your contact information]
- **System Administrator:** [Server admin contact]
- **Database Administrator:** [DB admin contact]

---

**Last Updated:** October 24, 2025
**Version:** 1.0.0