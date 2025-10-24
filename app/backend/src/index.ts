import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Config
import { serverConfig, getDatabasePool, testDatabaseConnection } from './config';

// Infrastructure
import { MySQLUserRepository } from './infrastructure/database/MySQLUserRepository';
import { MySQLRoomRepository } from './infrastructure/database/MySQLRoomRepository';
import { MySQLBookingRepository } from './infrastructure/database/MySQLBookingRepository';

// Application Services
import { TokenService } from './application/services/TokenService';
import { HashService } from './application/services/HashService';
import { RoomStatusService } from './application/services/RoomStatusService';

// Use Cases
import { RegisterUserUseCase } from './application/use-cases/auth/RegisterUser';
import { LoginUserUseCase } from './application/use-cases/auth/LoginUser';
import { UpdateUserRoleUseCase } from './application/use-cases/auth/UpdateUserRole';
import { CreateRoomUseCase } from './application/use-cases/rooms/CreateRoom';
import { GetAllRoomsUseCase } from './application/use-cases/rooms/GetAllRooms';
import { CreateBookingUseCase } from './application/use-cases/bookings/CreateBooking';
import { UpdateBookingUseCase } from './application/use-cases/bookings/UpdateBooking';
import { GetAnalyticsSummaryUseCase } from './application/use-cases/analytics/GetAnalyticsSummary';

// Presentation
import { AuthController } from './presentation/controllers/AuthController';
import { RoomController } from './presentation/controllers/RoomController';
import { BookingController } from './presentation/controllers/BookingController';
import { AnalyticsController } from './presentation/controllers/AnalyticsController';
import { createAuthRoutes } from './presentation/routes/auth.routes';
import { createRoomRoutes } from './presentation/routes/room.routes';
import { createBookingRoutes } from './presentation/routes/booking.routes';
import { createAnalyticsRoutes } from './presentation/routes/analytics.routes';
import { errorHandler } from './presentation/middlewares/errorHandler';
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
  public readonly pool = getDatabasePool();
  public readonly userRepository = new MySQLUserRepository(this.pool);
  public readonly roomRepository = new MySQLRoomRepository(this.pool);
  public readonly bookingRepository = new MySQLBookingRepository(this.pool);

  // Application Services
  public readonly tokenService = new TokenService();
  public readonly hashService = new HashService();
  public readonly roomStatusService = new RoomStatusService();

  // Use Cases
  public readonly registerUserUseCase = new RegisterUserUseCase(
    this.userRepository,
    this.hashService,
    this.tokenService
  );
  public readonly loginUserUseCase = new LoginUserUseCase(
    this.userRepository,
    this.hashService,
    this.tokenService
  );
  public readonly updateUserRoleUseCase = new UpdateUserRoleUseCase(
    this.userRepository
  );
  public readonly createRoomUseCase = new CreateRoomUseCase(this.roomRepository);
  public readonly getAllRoomsUseCase = new GetAllRoomsUseCase(this.roomRepository);
  public readonly createBookingUseCase = new CreateBookingUseCase(
    this.bookingRepository,
    this.roomRepository
  );
  public readonly updateBookingUseCase = new UpdateBookingUseCase(
    this.bookingRepository,
    this.roomRepository
  );
  public readonly getAnalyticsSummaryUseCase = new GetAnalyticsSummaryUseCase(
    this.bookingRepository,
    this.roomRepository,
    this.roomStatusService
  );

  // Controllers
  public readonly authController = new AuthController(
    this.registerUserUseCase,
    this.loginUserUseCase,
    this.updateUserRoleUseCase
  );
  public readonly roomController = new RoomController(
    this.createRoomUseCase,
    this.getAllRoomsUseCase,
    this.roomRepository,
    this.bookingRepository,
    this.roomStatusService
  );
  public readonly bookingController = new BookingController(
    this.createBookingUseCase,
    this.updateBookingUseCase,
    this.bookingRepository
  );
  public readonly analyticsController = new AnalyticsController(
    this.getAnalyticsSummaryUseCase
  );
}

/**
 * CREATE EXPRESS APPLICATION
 */
const createApp = (container: DIContainer): Application => {
  const app = express();

  // Security & Performance Middleware
  app.use(helmet());
  app.use(cors({
    origin: serverConfig.corsOrigin,
    credentials: true,
  }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Health Check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: serverConfig.nodeEnv,
    });
  });

  // API Routes
  const apiPrefix = serverConfig.apiPrefix;
  app.use(`${apiPrefix}/auth`, createAuthRoutes(container.authController, container.tokenService));
  app.use(`${apiPrefix}/rooms`, createRoomRoutes(container.roomController, container.tokenService));
  app.use(`${apiPrefix}/bookings`, createBookingRoutes(container.bookingController, container.tokenService));
  app.use(`${apiPrefix}/analytics`, createAnalyticsRoutes(container.analyticsController));

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
  app.use(errorHandler);

  return app;
};

/**
 * START SERVER
 */
const startServer = async () => {
  try {
    console.log('🚀 Starting FMRB Backend...');
    console.log(`📦 Environment: ${serverConfig.nodeEnv}`);

    // Test Database Connection
    await testDatabaseConnection();

    // Initialize DI Container
    const container = new DIContainer();

    // Create Express App
    const app = createApp(container);

    // Start Server
    app.listen(serverConfig.port, () => {
      console.log('✅ Server is running!');
      console.log(`🌐 URL: http://localhost:${serverConfig.port}`);
      console.log(`📡 API: http://localhost:${serverConfig.port}${serverConfig.apiPrefix}`);
      console.log(`💾 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  POST ${serverConfig.apiPrefix}/auth/register`);
      console.log(`  POST ${serverConfig.apiPrefix}/auth/login`);
      console.log(`  GET  ${serverConfig.apiPrefix}/rooms`);
      console.log(`  POST ${serverConfig.apiPrefix}/rooms`);
      console.log(`  GET  ${serverConfig.apiPrefix}/bookings`);
      console.log(`  POST ${serverConfig.apiPrefix}/bookings`);
      console.log(`  GET  ${serverConfig.apiPrefix}/analytics/summary`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
