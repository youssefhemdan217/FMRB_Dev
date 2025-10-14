import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { authenticate } from '../middlewares/authenticate';
import { TokenService } from '../../application/services/TokenService';

export const createAuthRoutes = (
  authController: AuthController,
  tokenService: TokenService
): Router => {
  const router = Router();

  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login', validate(loginSchema), authController.login);
  router.post('/logout', authenticate(tokenService), authController.logout);
  router.put('/users/:userId/role', authController.updateRole);

  return router;
};

