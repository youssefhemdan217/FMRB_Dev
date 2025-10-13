import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { TokenService } from '../../application/services/TokenService';

export const createBookingRoutes = (
  bookingController: BookingController,
  _tokenService: TokenService
): Router => {
  const router = Router();

  // Public routes (no auth needed for demo)
  router.get('/', bookingController.getAll);
  router.get('/:id', bookingController.getById);
  router.post('/', bookingController.create);
  router.delete('/:id', bookingController.delete);

  return router;
};

