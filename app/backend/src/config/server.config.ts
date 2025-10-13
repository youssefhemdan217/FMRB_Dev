import { env } from './env.config';

export const serverConfig = {
  port: env.PORT,
  apiPrefix: env.API_PREFIX,
  nodeEnv: env.NODE_ENV,
  corsOrigin: env.CORS_ORIGIN,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
};

export default serverConfig;

