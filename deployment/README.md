# FMRB API Deployment Package

This package contains the complete FMRB (Facility Management Room Booking) API ready for deployment on IIS.

## Contents

- `index.js` - Main application entry point
- `package.json` - Production dependencies
- `web.config` - IIS configuration file
- `.env` - Environment variables
- All compiled application files and dependencies

## API Endpoints

The API will be available at: `http://your-server/api/v1/`

### Available Endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/rooms` - Get all rooms (public)
- `GET /api/v1/rooms/:id` - Get room by ID (public)
- `POST /api/v1/rooms` - Create room (requires auth)
- `PUT /api/v1/rooms/:id` - Update room (requires auth)
- `DELETE /api/v1/rooms/:id` - Delete room (requires admin)
- `GET /api/v1/bookings` - Get bookings (requires auth)
- `POST /api/v1/bookings` - Create booking (requires auth)
- `PUT /api/v1/bookings/:id` - Update booking (requires auth)
- `DELETE /api/v1/bookings/:id` - Delete booking (requires auth)
- `GET /api/v1/analytics/summary` - Get analytics (requires admin)

## Deployment Steps

### Prerequisites
1. Windows Server with IIS
2. Node.js installed (version 14 or higher)
3. IISNode module installed

### Installation
1. **Copy Files**: Copy this entire folder to `C:\inetpub\wwwroot\MeetingBookingApi\`

2. **Install Dependencies**: Run the `DEPLOY.bat` file to install production dependencies

3. **Configure IIS**:
   - Open IIS Manager
   - Create a new site or application
   - Point the physical path to your deployment folder
   - Set the application pool to "No Managed Code"

4. **Database Setup**:
   - Ensure MySQL server is running
   - Database connection is configured in the environment variables
   - The application will connect to the production database automatically

5. **Test Deployment**:
   - Visit: `http://your-server/api/v1/rooms`
   - Should return JSON response with rooms data

## Configuration

### Environment Variables (.env)
- `PORT` - Will be auto-assigned by IIS (named pipe)
- `NODE_ENV=production`
- `API_PREFIX=/api/v1`
- `DB_ENVIRONMENT=production`
- JWT secrets and database credentials are pre-configured

### Database
The application is configured to use the production MySQL database:
- Host: `SPMWSM02X3ZD.saipemnet.saipem.intranet`
- Database: `fmrb_db`
- User: `user`

## Troubleshooting

### Common Issues:
1. **500 Internal Server Error**: Check that IISNode is installed and working
2. **404 Not Found**: Verify the web.config file is present and the site is configured correctly
3. **Database Connection**: Ensure the MySQL server is accessible and credentials are correct

### Logs:
- Check IIS logs in: `C:\inetpub\logs\LogFiles\`
- Application logs will be written to the console/IIS output

## Support
For issues or questions, contact the development team.

---
Package created: $(Get-Date)
Version: 1.0.0