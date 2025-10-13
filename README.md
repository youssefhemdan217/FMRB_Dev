# FMRB (Facility/Meeting Room Booking) - Monorepo

A full-stack Meeting Room Booking application built with modern web technologies in a monorepo structure.

## 📁 Project Structure

```
FMRB_Dev/
├── app/
│   ├── frontend/          # React + TypeScript + Vite
│   └── backend/           # Node.js + TypeScript + Express
├── package.json           # Root workspace configuration
└── README.md
```

## 🚀 Tech Stack

### Frontend (`app/frontend`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Styling**: Tailwind CSS
- **Calendar**: FullCalendar
- **Routing**: React Router v6
- **Date Handling**: date-fns

### Backend (`app/backend`)
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Dev Tools**: Nodemon, ts-node

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Install all dependencies for both frontend and backend:

```bash
npm install
```

This will install dependencies in all workspaces.

### Development

**Run both frontend and backend concurrently:**
```bash
npm run dev
```

**Run individually:**
```bash
# Frontend only (http://localhost:5173)
npm run dev:frontend

# Backend only (http://localhost:3000)
npm run dev:backend
```

### Building

**Build all workspaces:**
```bash
npm run build
```

**Build individually:**
```bash
npm run build:frontend
npm run build:backend
```

## 📦 Workspace Commands

The monorepo uses npm workspaces. Available commands:

```bash
# Install all dependencies
npm install

# Run dev servers for both apps
npm run dev

# Build all apps
npm run build

# Lint all apps
npm run lint

# Run tests in all apps
npm run test

# Clean all build artifacts
npm run clean
```

## 🏗️ Architecture

The application follows clean architecture principles with clear separation of concerns:

### Frontend Architecture
- **Components**: Organized by feature (rooms, calendar, analytics)
- **State Management**: Redux slices for rooms, bookings, and UI
- **Custom Hooks**: Business logic encapsulation
- **Type Safety**: Full TypeScript coverage

### Backend Architecture
- **Controllers**: Request handling and response formatting
- **Routes**: API endpoint definitions
- **Middleware**: Error handling and request processing
- **Types**: Shared TypeScript interfaces

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Rooms
- `GET /rooms` - Get all rooms
- `GET /rooms/:id` - Get specific room
- `POST /rooms` - Create room
- `PUT /rooms/:id` - Update room
- `DELETE /rooms/:id` - Delete room

### Bookings
- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get specific booking
- `GET /bookings/room/:roomId` - Get room bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Delete booking

## 🎯 Features

- ✅ Room browsing and filtering
- ✅ Interactive calendar view
- ✅ Booking management (CRUD)
- ✅ Room availability tracking
- ✅ Analytics dashboard
- ✅ Responsive design
- ✅ Real-time status updates
- ✅ Form validation
- ✅ Toast notifications

## 🚧 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] WebSocket for real-time updates
- [ ] Email notifications
- [ ] Recurring bookings
- [ ] Room equipment management
- [ ] Mobile app (React Native)
- [ ] API documentation (Swagger)
- [ ] Unit and integration tests

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configurations
- Use functional components with hooks
- Keep components small and focused
- Write descriptive commit messages

### Git Workflow
- Create feature branches from `main`
- Use meaningful branch names (e.g., `feature/add-user-auth`)
- Submit pull requests for review
- Keep commits atomic and well-described

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
