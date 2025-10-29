import { IBookingRepository } from '../../../domain/interfaces/IBookingRepository';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Booking } from '../../../domain/entities/Booking';
import { CreateBookingDTO } from '../../dtos/BookingDTO';
export declare class CreateBookingUseCase {
    private bookingRepository;
    private roomRepository;
    constructor(bookingRepository: IBookingRepository, roomRepository: IRoomRepository);
    execute(data: CreateBookingDTO): Promise<Booking>;
}
//# sourceMappingURL=CreateBooking.d.ts.map