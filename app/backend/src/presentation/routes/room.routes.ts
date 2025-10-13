import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { TokenService } from '../../application/services/TokenService';
import { UserRole } from '../../domain/entities/User';

export const createRoomRoutes = (
  roomController: RoomController,
  tokenService: TokenService
): Router => {
  const router = Router();

  // Public routes
  router.get('/', roomController.getAll);
  router.get('/:id', roomController.getById);

  // Protected routes (require authentication)
  router.post('/', authenticate(tokenService), roomController.create);
  router.put('/:id', authenticate(tokenService), roomController.update);
  router.delete('/:id', authenticate(tokenService), authorize(UserRole.ADMIN), roomController.delete);

  return router;
};

