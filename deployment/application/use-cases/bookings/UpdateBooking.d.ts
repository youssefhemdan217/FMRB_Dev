import { IBookingRepository } from '../../../domain/interfaces/IBookingRepository';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Booking } from '../../../domain/entities/Booking';
import { UpdateBookingDTO } from '../../dtos/BookingDTO';
export declare class UpdateBookingUseCase {
    private bookingRepository;
    private roomRepository;
    constructor(bookingRepository: IBookingRepository, roomRepository: IRoomRepository);
    execute(id: string, data: UpdateBookingDTO): Promise<Booking>;
}
//# sourceMappingURL=UpdateBooking.d.ts.map