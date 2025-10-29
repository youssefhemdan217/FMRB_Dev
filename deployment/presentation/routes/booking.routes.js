"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingRoutes = void 0;
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const User_1 = require("../../domain/entities/User");
const createBookingRoutes = (bookingController, tokenService) => {
    const router = (0, express_1.Router)();
    // Public routes (no auth needed for demo)
    router.get('/', bookingController.getAll);
    router.get('/:id', bookingController.getById);
    router.post('/', bookingController.create);
    router.put('/:id', bookingController.update);
    router.delete('/:id', bookingController.delete);
    // Approval routes (protected): only approval or admin
    // Using authenticate + authorize(UserRole.APPROVAL, UserRole.ADMIN)
    router.patch('/:id/approve', (0, authenticate_1.authenticate)(tokenService), (0, authorize_1.authorize)(User_1.UserRole.APPROVAL, User_1.UserRole.ADMIN), async (req, res, next) => {
        try {
            const booking = await bookingController.updateBookingUseCase.execute(req.params.id, { status: 'approved' });
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
    });
    router.patch('/:id/decline', (0, authenticate_1.authenticate)(tokenService), (0, authorize_1.authorize)(User_1.UserRole.APPROVAL, User_1.UserRole.ADMIN), async (req, res, next) => {
        try {
            const booking = await bookingController.updateBookingUseCase.execute(req.params.id, { status: 'declined' });
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
    });
    return router;
};
exports.createBookingRoutes = createBookingRoutes;
//# sourceMappingURL=booking.routes.js.map