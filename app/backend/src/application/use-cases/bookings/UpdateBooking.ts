import { IBookingRepository } from '../../../domain/interfaces/IBookingRepository';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Booking } from '../../../domain/entities/Booking';
import { ValidationError, NotFoundError, ConflictError } from '../../../domain/errors/DomainErrors';
import { UpdateBookingDTO } from '../../dtos/BookingDTO';

export class UpdateBookingUseCase {
  constructor(
    private bookingRepository: IBookingRepository,
    private roomRepository: IRoomRepository
  ) {}

  async execute(id: string, data: UpdateBookingDTO): Promise<Booking> {
    // Validate input
    if (!id) {
      throw new ValidationError('Booking ID is required');
    }

    // Check if booking exists
    const existingBooking = await this.bookingRepository.findById(id);
    if (!existingBooking) {
      throw new NotFoundError('Booking', id);
    }

    // Prepare update data with existing values as fallback
    const updateData = {
      title: data.title || existingBooking.title,
      organizer: data.organizer !== undefined ? data.organizer : existingBooking.organizer,
      start: data.start ? new Date(data.start) : existingBooking.start,
      end: data.end ? new Date(data.end) : existingBooking.end,
    };

    // Validate dates if provided
    if (updateData.start >= updateData.end) {
      throw new ValidationError('End time must be after start time');
    }

    // Check if room exists and is active
    const room = await this.roomRepository.findById(existingBooking.roomId);
    if (!room) {
      throw new NotFoundError('Room', existingBooking.roomId);
    }

    if (!room.isActive) {
      throw new ValidationError('Room is not active');
    }

    // Check for overlapping bookings (excluding current booking)
    const overlappingBookings = await this.bookingRepository.findOverlapping(
      existingBooking.roomId,
      updateData.start,
      updateData.end,
      id // Exclude current booking from overlap check
    );

    if (overlappingBookings.length > 0) {
      throw new ConflictError('Time slot is already booked');
    }

    // Update booking
    return this.bookingRepository.update(id, {
      title: updateData.title,
      organizer: updateData.organizer,
      start: updateData.start,
      end: updateData.end,
    });
  }
}
