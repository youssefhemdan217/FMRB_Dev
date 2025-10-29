"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnalyticsSummaryUseCase = void 0;
class GetAnalyticsSummaryUseCase {
    bookingRepository;
    roomRepository;
    roomStatusService;
    constructor(bookingRepository, roomRepository, roomStatusService) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.roomStatusService = roomStatusService;
    }
    async execute(startDate, endDate, roomId) {
        const rooms = roomId
            ? [await this.roomRepository.findById(roomId)].filter(Boolean)
            : await this.roomRepository.findAll();
        const activeRooms = rooms.filter(r => r && r.isActive);
        const allBookings = await this.bookingRepository.findAll();
        // Filter bookings by date range
        const filteredBookings = allBookings.filter(b => b.start >= startDate && b.end <= endDate &&
            (!roomId || b.roomId === roomId));
        // Calculate available rooms now
        let availableCount = 0;
        for (const room of activeRooms) {
            if (!room)
                continue;
            const roomBookings = allBookings.filter(b => b.roomId === room.id);
            const status = this.roomStatusService.calculateStatus(room, roomBookings);
            if (status.status === 'available') {
                availableCount++;
            }
        }
        // Calculate utilization
        const totalMinutes = this.calculateTotalAvailableMinutes(activeRooms, startDate, endDate);
        const bookedMinutes = this.calculateBookedMinutes(filteredBookings);
        const utilization = totalMinutes > 0 ? (bookedMinutes / totalMinutes) * 100 : 0;
        // Calculate peak hour
        const peakHour = this.calculatePeakHour(filteredBookings);
        // Calculate avg meeting duration
        const totalDuration = filteredBookings.reduce((sum, b) => sum + (b.end.getTime() - b.start.getTime()), 0);
        const avgMeetingDuration = filteredBookings.length > 0
            ? Math.round(totalDuration / filteredBookings.length / 60000)
            : 0;
        // Find top room
        const topRoom = await this.findTopRoom(filteredBookings, rooms);
        return {
            utilization: Math.round(utilization * 10) / 10,
            availableRooms: availableCount,
            totalRooms: activeRooms.length,
            peakHour,
            avgMeetingDuration,
            topRoom,
        };
    }
    calculateTotalAvailableMinutes(rooms, startDate, endDate) {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return rooms.reduce((total, room) => {
            if (!room)
                return total;
            const startHour = parseInt(room.workHours.start.split(':')[0]);
            const endHour = parseInt(room.workHours.end.split(':')[0]);
            const hoursPerDay = endHour - startHour;
            return total + (hoursPerDay * 60 * days);
        }, 0);
    }
    calculateBookedMinutes(bookings) {
        return bookings.reduce((total, booking) => {
            const duration = (booking.end.getTime() - booking.start.getTime()) / 60000;
            return total + duration;
        }, 0);
    }
    calculatePeakHour(bookings) {
        const hourCounts = {};
        bookings.forEach(booking => {
            const hour = new Date(booking.start).getHours();
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            hourCounts[hourStr] = (hourCounts[hourStr] || 0) + 1;
        });
        const peakHourEntry = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
        return peakHourEntry ? peakHourEntry[0] : '10:00';
    }
    async findTopRoom(bookings, rooms) {
        const roomBookedTime = {};
        bookings.forEach(booking => {
            const duration = (booking.end.getTime() - booking.start.getTime()) / 60000;
            roomBookedTime[booking.roomId] = (roomBookedTime[booking.roomId] || 0) + duration;
        });
        const topRoomId = Object.entries(roomBookedTime).sort((a, b) => b[1] - a[1])[0]?.[0];
        if (!topRoomId)
            return null;
        const room = rooms.find(r => r && r.id === topRoomId);
        if (!room)
            return null;
        const minutes = roomBookedTime[topRoomId];
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return {
            name: room.name,
            bookedTime: `${hours}h ${mins}m`,
        };
    }
}
exports.GetAnalyticsSummaryUseCase = GetAnalyticsSummaryUseCase;
//# sourceMappingURL=GetAnalyticsSummary.js.map