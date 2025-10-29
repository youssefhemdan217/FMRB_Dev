"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingUseCase = void 0;
const DomainErrors_1 = require("../../../domain/errors/DomainErrors");
class CreateBookingUseCase {
    bookingRepository;
    roomRepository;
    constructor(bookingRepository, roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }
    async execute(data) {
        // Validate input
        if (!data.roomId || !data.title || !data.start || !data.end) {
            throw new DomainErrors_1.ValidationError('Room ID, title, start, and end are required');
        }
        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        if (startDate >= endDate) {
            throw new DomainErrors_1.ValidationError('End time must be after start time');
        }
        // Check if room exists
        const room = await this.roomRepository.findById(data.roomId);
        if (!room) {
            throw new DomainErrors_1.NotFoundError('Room', data.roomId);
        }
        if (!room.isActive) {
            throw new DomainErrors_1.ValidationError('Room is not active');
        }
        // Check for overlapping bookings
        const overlappingBookings = await this.bookingRepository.findOverlapping(data.roomId, startDate, endDate);
        if (overlappingBookings.length > 0) {
            throw new DomainErrors_1.ConflictError('Time slot is already booked');
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
exports.CreateBookingUseCase = CreateBookingUseCase;
//# sourceMappingURL=CreateBooking.js.map