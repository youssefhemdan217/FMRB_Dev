import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authenticate';
import { CreateBookingUseCase } from '../../application/use-cases/bookings/CreateBooking';
import { UpdateBookingUseCase } from '../../application/use-cases/bookings/UpdateBooking';
import { IBookingRepository } from '../../domain/interfaces/IBookingRepository';
export declare class BookingController {
    private createBookingUseCase;
    private updateBookingUseCase;
    private bookingRepository;
    constructor(createBookingUseCase: CreateBookingUseCase, updateBookingUseCase: UpdateBookingUseCase, bookingRepository: IBookingRepository);
    getAll: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    create: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    update: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=BookingController.d.ts.map