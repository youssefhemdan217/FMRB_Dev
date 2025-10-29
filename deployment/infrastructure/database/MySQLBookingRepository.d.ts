import { Pool } from 'mysql2/promise';
import { IBookingRepository } from '../../domain/interfaces/IBookingRepository';
import { Booking, BookingCreateData, BookingUpdateData } from '../../domain/entities/Booking';
export declare class MySQLBookingRepository implements IBookingRepository {
    private pool;
    constructor(pool: Pool);
    create(data: BookingCreateData): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    findAll(): Promise<Booking[]>;
    findByRoomId(roomId: string): Promise<Booking[]>;
    findByUserId(userId: string): Promise<Booking[]>;
    findOverlapping(roomId: string, start: Date, end: Date, excludeId?: string): Promise<Booking[]>;
    update(id: string, data: BookingUpdateData): Promise<Booking>;
    delete(id: string): Promise<void>;
    private mapRowToBooking;
}
//# sourceMappingURL=MySQLBookingRepository.d.ts.map