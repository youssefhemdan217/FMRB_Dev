import { Booking, BookingCreateData, BookingUpdateData } from '../entities/Booking';

export interface IBookingRepository {
  create(data: BookingCreateData): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  findByRoomId(roomId: string): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  findOverlapping(roomId: string, start: Date, end: Date, excludeId?: string): Promise<Booking[]>;
  update(id: string, data: BookingUpdateData): Promise<Booking>;
  delete(id: string): Promise<void>;
}

