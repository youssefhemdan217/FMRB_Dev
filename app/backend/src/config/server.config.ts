import { env } from './env.config';

// Parse CORS origin - supports '*' for all origins or comma-separated list
const parseCorsOrigin = (origin: string): string | string[] => {
  if (origin === '*') {
    return '*';
  }
  // Split by comma and trim whitespace
  const origins = origin.split(',').map(o => o.trim()).filter(o => o.length > 0);
  return origins.length === 1 ? origins[0] : origins;
};

export const serverConfig = {
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  nodeEnv: env.NODE_ENV,
  corsOrigin: parseCorsOrigin(env.CORS_ORIGIN),
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
};

export default serverConfig;

