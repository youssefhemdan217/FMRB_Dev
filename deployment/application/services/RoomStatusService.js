"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomStatusService = void 0;
class RoomStatusService {
    /**
     * Calculate the current status of a room based on its bookings
     */
    calculateStatus(room, bookings) {
        const now = new Date();
        // Check if room is active
        if (!room.isActive) {
            return {
                status: 'unavailable',
                statusMessage: 'Room is inactive',
            };
        }
        // Check if within work hours
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (currentTime < room.workHours.start || currentTime > room.workHours.end) {
            return {
                status: 'unavailable',
                statusMessage: 'Outside work hours',
            };
        }
        // Find current booking
        const currentBooking = bookings.find((booking) => booking.start <= now && booking.end > now);
        if (currentBooking) {
            const endTime = new Date(currentBooking.end).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            return {
                status: 'busy',
                statusMessage: `Busy until ${endTime}`,
                nextChange: currentBooking.end.toISOString(),
            };
        }
        // Find next booking
        const futureBookings = bookings
            .filter((booking) => booking.start > now)
            .sort((a, b) => a.start.getTime() - b.start.getTime());
        if (futureBookings.length > 0) {
            const nextBooking = futureBookings[0];
            const startTime = new Date(nextBooking.start).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            return {
                status: 'available',
                statusMessage: `Available until ${startTime}`,
                nextChange: nextBooking.start.toISOString(),
            };
        }
        return {
            status: 'available',
            statusMessage: 'Available',
        };
    }
}
exports.RoomStatusService = RoomStatusService;
//# sourceMappingURL=RoomStatusService.js.map