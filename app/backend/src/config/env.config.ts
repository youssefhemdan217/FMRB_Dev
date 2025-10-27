import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env from the backend root directory
// In production (IIS), the working directory is usually the application root
// So we go up from dist/config to the backend root
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

console.log('🔧 Loading .env from:', envPath);

// Environment variable schema with validation
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  API_PREFIX: z.string().default('/api/v1'),
  
  // Database Environment (determines which connection string to use)
  DB_ENVIRONMENT: z.enum(['local', 'production']).default('local'),
  
  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // CORS
  // Use '*' to allow all origins, or provide specific origins separated by commas
  // Example: 'http://localhost:5173,https://example.com' or '*'
  CORS_ORIGIN: z.string().default('*'),
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

export const env = parseEnv();

export default env;

