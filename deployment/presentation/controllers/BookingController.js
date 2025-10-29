"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const DomainErrors_1 = require("../../domain/errors/DomainErrors");
class BookingController {
    createBookingUseCase;
    updateBookingUseCase;
    bookingRepository;
    constructor(createBookingUseCase, updateBookingUseCase, bookingRepository) {
        this.createBookingUseCase = createBookingUseCase;
        this.updateBookingUseCase = updateBookingUseCase;
        this.bookingRepository = bookingRepository;
    }
    getAll = async (req, res, next) => {
        try {
            const { roomId, status } = req.query;
            let bookings;
            if (roomId) {
                bookings = await this.bookingRepository.findByRoomId(roomId);
            }
            else {
                bookings = await this.bookingRepository.findAll();
            }
            // Map to response format matching frontend
            const response = bookings.map(booking => ({
                id: booking.id,
                roomId: booking.roomId,
                userId: booking.userId,
                title: booking.title,
                organizer: booking.organizer,
                start: booking.start.toISOString(),
                end: booking.end.toISOString(),
                status: booking.status,
                createdAt: booking.createdAt.toISOString(),
            }));
            // Optional filter by status on server side to support /bookings?status=pending
            const filtered = status ? response.filter(b => b.status === status) : response;
            res.json(filtered);
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const booking = await this.bookingRepository.findById(req.params.id);
            if (!booking) {
                throw new DomainErrors_1.NotFoundError('Booking', req.params.id);
            }
            res.json({
                id: booking.id,
                roomId: booking.roomId,
                userId: booking.userId,
                title: booking.title,
                organizer: booking.organizer,
                start: booking.start.toISOString(),
                end: booking.end.toISOString(),
                status: booking.status,
                createdAt: booking.createdAt.toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const booking = await this.createBookingUseCase.execute(req.body);
            res.status(201).json({
                id: booking.id,
                roomId: booking.roomId,
                title: booking.title,
                organizer: booking.organizer,
                start: booking.start.toISOString(),
                end: booking.end.toISOString(),
                status: booking.status,
                createdAt: booking.createdAt.toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const booking = await this.updateBookingUseCase.execute(req.params.id, req.body);
            res.json({
                id: booking.id,
                roomId: booking.roomId,
                title: booking.title,
                organizer: booking.organizer,
                start: booking.start.toISOString(),
                end: booking.end.toISOString(),
                status: booking.status,
                createdAt: booking.createdAt.toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await this.bookingRepository.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.BookingController = BookingController;
//# sourceMappingURL=BookingController.js.map