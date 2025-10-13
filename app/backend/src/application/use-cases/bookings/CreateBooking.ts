import { IBookingRepository } from '../../../domain/interfaces/IBookingRepository';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Booking } from '../../../domain/entities/Booking';
import { ValidationError, NotFoundError, ConflictError } from '../../../domain/errors/DomainErrors';
import { CreateBookingDTO } from '../../dtos/BookingDTO';

export class CreateBookingUseCase {
  constructor(
    private bookingRepository: IBookingRepository,
    private roomRepository: IRoomRepository
  ) {}

  async execute(data: CreateBookingDTO): Promise<Booking> {
    // Validate input
    if (!data.roomId || !data.title || !data.start || !data.end) {
      throw new ValidationError('Room ID, title, start, and end are required');
    }

    const startDate = new Date(data.start);
    const endDate = new Date(data.end);

    if (startDate >= endDate) {
      throw new ValidationError('End time must be after start time');
    }

    // Check if room exists
    const room = await this.roomRepository.findById(data.roomId);
    if (!room) {
      throw new NotFoundError('Room', data.roomId);
    }

    if (!room.isActive) {
      throw new ValidationError('Room is not active');
    }

    // Check for overlapping bookings
    const overlappingBookings = await this.bookingRepository.findOverlapping(
      data.roomId,
      startDate,
      endDate
    );

    if (overlappingBookings.length > 0) {
      throw new ConflictError('Time slot is already booked');
    }

    // Create booking
    return this.bookingRepository.create({
      roomId: data.roomId,
      title: data.title,
      organizer: data.organizer,
      start: startDate,
      end: endDate,
    });
  }
}

