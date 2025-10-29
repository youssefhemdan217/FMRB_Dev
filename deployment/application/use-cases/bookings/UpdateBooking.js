"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookingUseCase = void 0;
const DomainErrors_1 = require("../../../domain/errors/DomainErrors");
class UpdateBookingUseCase {
    bookingRepository;
    roomRepository;
    constructor(bookingRepository, roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }
    async execute(id, data) {
        // Validate input
        if (!id) {
            throw new DomainErrors_1.ValidationError('Booking ID is required');
        }
        // Check if booking exists
        const existingBooking = await this.bookingRepository.findById(id);
        if (!existingBooking) {
            throw new DomainErrors_1.NotFoundError('Booking', id);
        }
        // Prepare update data with existing values as fallback
        const updateData = {
            title: data.title || existingBooking.title,
            organizer: data.organizer !== undefined ? data.organizer : existingBooking.organizer,
            start: data.start ? new Date(data.start) : existingBooking.start,
            end: data.end ? new Date(data.end) : existingBooking.end,
            status: data.status !== undefined ? data.status : existingBooking.status,
        };
        // Validate dates if provided
        if (updateData.start >= updateData.end) {
            throw new DomainErrors_1.ValidationError('End time must be after start time');
        }
        // Check if room exists and is active
        const room = await this.roomRepository.findById(existingBooking.roomId);
        if (!room) {
            throw new DomainErrors_1.NotFoundError('Room', existingBooking.roomId);
        }
        if (!room.isActive) {
            throw new DomainErrors_1.ValidationError('Room is not active');
        }
        // Check for overlapping bookings (excluding current booking) if time changed
        if (updateData.start.getTime() !== existingBooking.start.getTime() || updateData.end.getTime() !== existingBooking.end.getTime()) {
            const overlappingBookings = await this.bookingRepository.findOverlapping(existingBooking.roomId, updateData.start, updateData.end, id // Exclude current booking from overlap check
            );
            if (overlappingBookings.length > 0) {
                throw new DomainErrors_1.ConflictError('Time slot is already booked');
            }
        }
        // Update booking
        return this.bookingRepository.update(id, {
            title: updateData.title,
            organizer: updateData.organizer,
            start: updateData.start,
            end: updateData.end,
            status: updateData.status,
        });
    }
}
exports.UpdateBookingUseCase = UpdateBookingUseCase;
//# sourceMappingURL=UpdateBooking.js.map