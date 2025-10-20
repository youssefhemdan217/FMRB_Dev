import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { TokenService } from '../../application/services/TokenService';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { UserRole } from '../../domain/entities/User';

export const createBookingRoutes = (
  bookingController: BookingController,
  tokenService: TokenService
): Router => {
  const router = Router();

  // Public routes (no auth needed for demo)
  router.get('/', bookingController.getAll);
  router.get('/:id', bookingController.getById);
  router.post('/', bookingController.create);
  router.put('/:id', bookingController.update);
  router.delete('/:id', bookingController.delete);

  // Approval routes (protected): only approval or admin
  // Using authenticate + authorize(UserRole.APPROVAL, UserRole.ADMIN)
  router.patch(
    '/:id/approve',
    authenticate(tokenService),
    authorize(UserRole.APPROVAL, UserRole.ADMIN),
    async (req, res, next) => {
      try {
        const booking = await (bookingController as any).updateBookingUseCase.execute(req.params.id, { status: 'approved' });
        res.json({
          id: booking.id,
          roomId: booking.roomId,
          userId: booking.userId,
          title: booking.title,
          organizer: booking.organizer,
          start: booking.start.toISOString(),
          end: booking.end.toISOString(),
          status: booking.status,
          createdAt: booking.createdAt.toISOString(),
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.patch(
    '/:id/decline',
    authenticate(tokenService),
    authorize(UserRole.APPROVAL, UserRole.ADMIN),
    async (req, res, next) => {
      try {
        const booking = await (bookingController as any).updateBookingUseCase.execute(req.params.id, { status: 'declined' });
        res.json({
          id: booking.id,
          roomId: booking.roomId,
          userId: booking.userId,
          title: booking.title,
          organizer: booking.organizer,
          start: booking.start.toISOString(),
          end: booking.end.toISOString(),
          status: booking.status,
          createdAt: booking.createdAt.toISOString(),
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};

