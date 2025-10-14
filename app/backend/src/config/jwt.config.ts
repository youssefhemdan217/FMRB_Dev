import { env } from './env.config';

export const jwtConfig = {
  access: {
    secret: env.JWT_ACCESS_SECRET,
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
  },
};

export default jwtConfig;

