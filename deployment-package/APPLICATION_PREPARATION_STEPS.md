# FMRB API - Application Preparation Guide

## Step-by-Step Application Preparation for IIS Deployment

This guide walks you through preparing your FMRB Node.js API application for deployment to your company's IIS server.

---

## 🔧 **Step 1: Pre-Build Configuration**

### 1.1 Update Environment Configuration
✅ **COMPLETED** - Environment has been configured for production deployment

**What was configured:**
- Database connection switched to production server: `SPMWSM02X3ZD.saipemnet.saipem.intranet:3306`
- CORS configured to allow all origins (`CORS_ORIGIN=*`)
- Node environment set to production (`NODE_ENV=production`)

### 1.2 Verify Database Connection Settings
✅ **COMPLETED** - Production database configuration is ready

**Production Database Settings:**
```
Host: SPMWSM02X3ZD.saipemnet.saipem.intranet
Port: 3306
Database: fmrb_db
User: user
Password: Fabsi@1234
SSL: Disabled
```

---

## 🏗️ **Step 2: Build Application**

### 2.1 Install Dependencies
✅ **COMPLETED**
```bash
npm install
```

### 2.2 Compile TypeScript to JavaScript
✅ **COMPLETED**
```bash
npm run build
```

**Output:** All TypeScript files compiled to `dist/` folder

---

## 📦 **Step 3: Create Deployment Package**

### 3.1 Deployment Package Contents
✅ **COMPLETED** - Deployment package created at: `d:\Saipem\FMB\FMRB_Dev\deployment-package\`

**Package includes:**
```
deployment-package/
├── dist/                          # Compiled JavaScript application
├── node_modules/                  # All production dependencies
├── database/                      # Database schema and migration scripts
├── package.json                   # Package configuration
├── web.config                     # IIS configuration file
├── .env                          # Production environment variables
├── setup-database.ts             # Database setup script (TypeScript)
├── setup-production-database.bat # Database setup helper script
├── README-DEPLOYMENT.bat         # Deployment instructions
└── IIS_DEPLOYMENT_GUIDE.md       # Complete deployment guide
```

---

## 🔐 **Step 4: Security Configuration**

### 4.1 JWT Secrets Configuration
⚠️ **ACTION REQUIRED** - Update JWT secrets in production

**Current values in `.env` file:**
```env
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-min-32-chars-long-change-this
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-min-32-chars-long-change-this
```

**🚨 IMPORTANT:** Change these to strong, unique values before deployment!

**Recommended approach:**
1. Generate strong secrets using a password manager or online generator
2. Ensure each secret is at least 32 characters long
3. Use different secrets for access and refresh tokens
4. Keep these secrets secure and never commit them to version control

### 4.2 CORS Configuration
✅ **COMPLETED** - CORS configured to allow all origins
- Current setting: `CORS_ORIGIN=*`
- Application automatically handles this setting

---

## 🗄️ **Step 5: Database Preparation**

### 5.1 Database Connection Verification
✅ **COMPLETED** - Application configured to use production database

**Connection Details:**
- Server: `SPMWSM02X3ZD.saipemnet.saipem.intranet:3306`
- Database: `fmrb_db`
- Authentication: `user` / `Fabsi@1234`

### 5.2 Database Setup Script
✅ **COMPLETED** - Setup script ready for deployment

**On the target server, run:**
```cmd
setup-production-database.bat
```

This will:
- Set environment to production
- Create database if it doesn't exist
- Run schema creation scripts
- Insert seed data

---

## 📁 **Step 6: File Organization**

### 6.1 Essential Files for Server
✅ **COMPLETED** - All files organized in deployment package

**Critical files (must be copied to server):**
- `dist/` - The compiled application
- `node_modules/` - Dependencies
- `package.json` - Package configuration
- `web.config` - IIS configuration
- `.env` - Environment variables

**Database files:**
- `database/schema.sql` - Database schema
- `database/seed.sql` - Initial data
- `setup-database.ts` - Setup script

**Helper scripts:**
- `setup-production-database.bat` - Database setup
- `README-DEPLOYMENT.bat` - Quick reference

---

## 🚀 **Step 7: Pre-Deployment Checklist**

### 7.1 Application Readiness
- ✅ Application built successfully
- ✅ Dependencies installed
- ✅ Environment configured for production
- ✅ CORS configured for all origins
- ✅ Database connection string updated
- ⚠️ **TODO:** Update JWT secrets

### 7.2 Server Prerequisites
**Before transferring files, ensure the target server has:**
- [ ] Node.js v18+ installed
- [ ] IISNode module installed
- [ ] MySQL client tools (for database verification)
- [ ] IIS with required features enabled
- [ ] Proper permissions for application directory

### 7.3 Network Requirements
- [ ] Server can access MySQL database at `SPMWSM02X3ZD.saipemnet.saipem.intranet:3306`
- [ ] Firewall rules allow HTTP/HTTPS traffic to the application
- [ ] DNS resolution working for database server

---

## 📋 **Step 8: Deployment Package Transfer**

### 8.1 Recommended Transfer Method
1. **Create ZIP archive** of `deployment-package` folder
2. **Transfer to server** using secure method (RDP, secure file transfer)
3. **Extract on server** to `C:\inetpub\wwwroot\fmrb-api\` (or chosen directory)

### 8.2 Post-Transfer Verification
**On the server, verify:**
```cmd
# Navigate to application directory
cd C:\inetpub\wwwroot\fmrb-api

# Verify Node.js
node --version

# Verify main application file exists
dir dist\index.js

# Verify environment file
type .env
```

---

## 🔧 **Step 9: Server Configuration**

### 9.1 IIS Setup
**Follow the detailed steps in:** `IIS_DEPLOYMENT_GUIDE.md`

**Key configuration steps:**
1. Create application pool
2. Create IIS application
3. Configure permissions
4. Set up URL rewriting

### 9.2 Database Setup
**Run on the server:**
```cmd
setup-production-database.bat
```

---

## ✅ **Step 10: Testing & Validation**

### 10.1 Basic Connectivity Test
```cmd
# Test if application starts
node dist\index.js
```

### 10.2 API Endpoint Testing
```bash
# Health check
curl http://your-server/fmrb-api/api/v1/health

# Database connectivity test
curl http://your-server/fmrb-api/api/v1/rooms
```

---

## 🚨 **Important Notes**

### Security Reminders
1. **Change JWT secrets** before going live
2. **Restrict CORS** if needed for specific domains
3. **Use HTTPS** in production
4. **Keep database credentials secure**

### Performance Considerations
1. **Monitor application pool** memory usage
2. **Set up logging** for troubleshooting
3. **Configure application pool recycling**
4. **Monitor database connections**

---

## 📞 **Support Information**

If you encounter issues during deployment:

1. **Check logs:**
   - IIS logs: `C:\inetpub\logs\LogFiles\`
   - Application logs: `C:\inetpub\wwwroot\fmrb-api\iisnode\`

2. **Common troubleshooting:**
   - Verify Node.js installation
   - Check file permissions
   - Validate database connectivity
   - Review IIS application pool status

3. **Reference documentation:**
   - `IIS_DEPLOYMENT_GUIDE.md` - Complete deployment guide
   - `API_DOCUMENTATION.md` - API reference

---

**Application Status:** ✅ **Ready for Deployment**
**Package Location:** `d:\Saipem\FMB\FMRB_Dev\deployment-package\`
**Next Step:** Transfer package to server and follow IIS deployment guide