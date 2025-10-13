import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authenticate';
import { CreateBookingUseCase } from '../../application/use-cases/bookings/CreateBooking';
import { IBookingRepository } from '../../domain/interfaces/IBookingRepository';
import { NotFoundError } from '../../domain/errors/DomainErrors';

export class BookingController {
  constructor(
    private createBookingUseCase: CreateBookingUseCase,
    private bookingRepository: IBookingRepository
  ) {}

  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { roomId } = req.query;
      
      let bookings;
      if (roomId) {
        bookings = await this.bookingRepository.findByRoomId(roomId as string);
      } else {
        bookings = await this.bookingRepository.findAll();
      }

      // Map to response format matching frontend
      const response = bookings.map(booking => ({
        id: booking.id,
        roomId: booking.roomId,
        title: booking.title,
        organizer: booking.organizer,
        start: booking.start.toISOString(),
        end: booking.end.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      }));

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await this.bookingRepository.findById(req.params.id);
      if (!booking) {
        throw new NotFoundError('Booking', req.params.id);
      }
      res.json({
        id: booking.id,
        roomId: booking.roomId,
        title: booking.title,
        organizer: booking.organizer,
        start: booking.start.toISOString(),
        end: booking.end.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await this.createBookingUseCase.execute(req.body);
      
      res.status(201).json({
        id: booking.id,
        roomId: booking.roomId,
        title: booking.title,
        organizer: booking.organizer,
        start: booking.start.toISOString(),
        end: booking.end.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.bookingRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

