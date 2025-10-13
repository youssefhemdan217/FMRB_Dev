# FMRB Backend API

Node.js + TypeScript + Express + MySQL backend for the Meeting Room Booking application.

## Features

- ✅ RESTful API architecture
- ✅ TypeScript for type safety
- ✅ Express.js framework
- ✅ MySQL database with raw SQL queries
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan
- ✅ Environment-based configuration
- ✅ Automatic overlap detection for bookings
- ✅ Foreign key relationships

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MySQL (with mysql2)
- **Query Style:** Raw SQL (for learning)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL Server installed and running
- MySQL Workbench (recommended)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up MySQL Database:**
   - Follow the [MySQL Setup Guide](./MYSQL_SETUP.md)
   - Run `database/schema.sql` in MySQL Workbench
   - (Optional) Run `database/seed.sql` for sample data

3. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Update `DB_PASSWORD` with your MySQL password

```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_PASSWORD=your_mysql_password_here
```

### Development

```bash
npm run dev
```

Server will run on http://localhost:3000

You should see:
```
✅ MySQL Connected Successfully!
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api/v1
💾 Database: fmrb_db on localhost
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Rooms
- `GET /api/v1/rooms` - Get all rooms
- `GET /api/v1/rooms/:id` - Get room by ID
- `POST /api/v1/rooms` - Create new room
- `PUT /api/v1/rooms/:id` - Update room
- `DELETE /api/v1/rooms/:id` - Delete room

### Bookings
- `GET /api/v1/bookings` - Get all bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `GET /api/v1/bookings/room/:roomId` - Get bookings for a specific room
- `POST /api/v1/bookings` - Create new booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Delete booking

## Project Structure

```
src/
├── controllers/      # Request handlers
├── routes/          # API routes
├── middleware/      # Custom middleware
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Authentication & Authorization
- WebSocket support for real-time updates
- Data validation with Zod/Joi
- Unit and integration tests
- API documentation with Swagger

