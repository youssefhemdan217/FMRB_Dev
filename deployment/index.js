"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Config
const config_1 = require("./config");
// Infrastructure
const MySQLUserRepository_1 = require("./infrastructure/database/MySQLUserRepository");
const MySQLRoomRepository_1 = require("./infrastructure/database/MySQLRoomRepository");
const MySQLBookingRepository_1 = require("./infrastructure/database/MySQLBookingRepository");
// Application Services
const TokenService_1 = require("./application/services/TokenService");
const HashService_1 = require("./application/services/HashService");
const RoomStatusService_1 = require("./application/services/RoomStatusService");
// Use Cases
const RegisterUser_1 = require("./application/use-cases/auth/RegisterUser");
const LoginUser_1 = require("./application/use-cases/auth/LoginUser");
const UpdateUserRole_1 = require("./application/use-cases/auth/UpdateUserRole");
const CreateRoom_1 = require("./application/use-cases/rooms/CreateRoom");
const GetAllRooms_1 = require("./application/use-cases/rooms/GetAllRooms");
const CreateBooking_1 = require("./application/use-cases/bookings/CreateBooking");
const UpdateBooking_1 = require("./application/use-cases/bookings/UpdateBooking");
const GetAnalyticsSummary_1 = require("./application/use-cases/analytics/GetAnalyticsSummary");
// Presentation
const AuthController_1 = require("./presentation/controllers/AuthController");
const RoomController_1 = require("./presentation/controllers/RoomController");
const BookingController_1 = require("./presentation/controllers/BookingController");
const AnalyticsController_1 = require("./presentation/controllers/AnalyticsController");
const auth_routes_1 = require("./presentation/routes/auth.routes");
const room_routes_1 = require("./presentation/routes/room.routes");
const booking_routes_1 = require("./presentation/routes/booking.routes");
const analytics_routes_1 = require("./presentation/routes/analytics.routes");
const errorHandler_1 = require("./presentation/middlewares/errorHandler");
// import swaggerUi from 'swagger-ui-express';
// import fs from 'fs';
// import path from 'path';
// import YAML from 'yaml';
/**
 * DEPENDENCY INJECTION CONTAINER
 * This is where we wire up all our dependencies following Clean Architecture
 */
class DIContainer {
    // Infrastructure
    pool = (0, config_1.getDatabasePool)();
    userRepository = new MySQLUserRepository_1.MySQLUserRepository(this.pool);
    roomRepository = new MySQLRoomRepository_1.MySQLRoomRepository(this.pool);
    bookingRepository = new MySQLBookingRepository_1.MySQLBookingRepository(this.pool);
    // Application Services
    tokenService = new TokenService_1.TokenService();
    hashService = new HashService_1.HashService();
    roomStatusService = new RoomStatusService_1.RoomStatusService();
    // Use Cases
    registerUserUseCase = new RegisterUser_1.RegisterUserUseCase(this.userRepository, this.hashService, this.tokenService);
    loginUserUseCase = new LoginUser_1.LoginUserUseCase(this.userRepository, this.hashService, this.tokenService);
    updateUserRoleUseCase = new UpdateUserRole_1.UpdateUserRoleUseCase(this.userRepository);
    createRoomUseCase = new CreateRoom_1.CreateRoomUseCase(this.roomRepository);
    getAllRoomsUseCase = new GetAllRooms_1.GetAllRoomsUseCase(this.roomRepository);
    createBookingUseCase = new CreateBooking_1.CreateBookingUseCase(this.bookingRepository, this.roomRepository);
    updateBookingUseCase = new UpdateBooking_1.UpdateBookingUseCase(this.bookingRepository, this.roomRepository);
    getAnalyticsSummaryUseCase = new GetAnalyticsSummary_1.GetAnalyticsSummaryUseCase(this.bookingRepository, this.roomRepository, this.roomStatusService);
    // Controllers
    authController = new AuthController_1.AuthController(this.registerUserUseCase, this.loginUserUseCase, this.updateUserRoleUseCase);
    roomController = new RoomController_1.RoomController(this.createRoomUseCase, this.getAllRoomsUseCase, this.roomRepository, this.bookingRepository, this.roomStatusService);
    bookingController = new BookingController_1.BookingController(this.createBookingUseCase, this.updateBookingUseCase, this.bookingRepository);
    analyticsController = new AnalyticsController_1.AnalyticsController(this.getAnalyticsSummaryUseCase);
}
/**
 * CREATE EXPRESS APPLICATION
 */
const createApp = (container) => {
    const app = (0, express_1.default)();
    // Security & Performance Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: config_1.serverConfig.corsOrigin === '*' ? true : config_1.serverConfig.corsOrigin,
        credentials: true,
    }));
    app.use((0, morgan_1.default)('dev'));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Rate Limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
    });
    app.use(limiter);
    // Health Check
    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: config_1.serverConfig.nodeEnv,
        });
    });
    // API Routes
    const apiPrefix = config_1.serverConfig.apiPrefix;
    app.use(`${apiPrefix}/auth`, (0, auth_routes_1.createAuthRoutes)(container.authController, container.tokenService));
    app.use(`${apiPrefix}/rooms`, (0, room_routes_1.createRoomRoutes)(container.roomController, container.tokenService));
    app.use(`${apiPrefix}/bookings`, (0, booking_routes_1.createBookingRoutes)(container.bookingController, container.tokenService));
    app.use(`${apiPrefix}/analytics`, (0, analytics_routes_1.createAnalyticsRoutes)(container.analyticsController));
    // Swagger UI (local docs) - Temporarily disabled
    /*
    try {
      const openapiPath = path.resolve(__dirname, '../openapi.yaml');
      if (fs.existsSync(openapiPath)) {
        const file = fs.readFileSync(openapiPath, 'utf8');
        const openapiDoc = YAML.parse(file);
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
        console.log(`📖 Docs: http://localhost:${serverConfig.port}/docs`);
      }
    } catch (err) {
      console.warn('⚠️ Failed to load Swagger UI:', err);
    }
    */
    // 404 Handler
    app.use((_req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });
    // Global Error Handler
    app.use(errorHandler_1.errorHandler);
    return app;
};
/**
 * START SERVER
 */
const startServer = async () => {
    try {
        console.log('🚀 Starting FMRB Backend...');
        console.log(`📦 Environment: ${config_1.serverConfig.nodeEnv}`);
        // Test Database Connection
        await (0, config_1.testDatabaseConnection)();
        // Initialize DI Container
        const container = new DIContainer();
        // Create Express App
        const app = createApp(container);
        // Start Server
        const port = config_1.serverConfig.port;
        // Validate port (can be string for named pipes or number for regular ports)
        if (!port) {
            throw new Error(`Port is not defined. Received: ${port}`);
        }
        // If it's a string (named pipe), don't validate as number
        if (typeof port === 'string' && (port.includes('\\') || port.includes('pipe'))) {
            console.log(`🔧 Starting server on named pipe: ${port}`);
        }
        else if (typeof port === 'number') {
            if (isNaN(port) || port <= 0 || port >= 65536) {
                throw new Error(`Invalid port number: ${port}. Port must be a number between 1 and 65535.`);
            }
            console.log(`🔧 Starting server on port: ${port}`);
        }
        else {
            throw new Error(`Invalid port configuration: ${port} (type: ${typeof port})`);
        }
        app.listen(port, () => {
            console.log('✅ Server is running!');
            if (typeof port === 'string' && (port.includes('\\') || port.includes('pipe'))) {
                console.log(`🔌 Named pipe: ${port}`);
            }
            else {
                console.log(`🌐 URL: http://localhost:${port}`);
                console.log(`📡 API: http://localhost:${port}${config_1.serverConfig.apiPrefix}`);
            }
            console.log(`💾 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
            console.log('');
            console.log('Available endpoints:');
            console.log(`  POST ${config_1.serverConfig.apiPrefix}/auth/register`);
            console.log(`  POST ${config_1.serverConfig.apiPrefix}/auth/login`);
            console.log(`  GET  ${config_1.serverConfig.apiPrefix}/rooms`);
            console.log(`  POST ${config_1.serverConfig.apiPrefix}/rooms`);
            console.log(`  GET  ${config_1.serverConfig.apiPrefix}/bookings`);
            console.log(`  POST ${config_1.serverConfig.apiPrefix}/bookings`);
            console.log(`  GET  ${config_1.serverConfig.apiPrefix}/analytics/summary`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map