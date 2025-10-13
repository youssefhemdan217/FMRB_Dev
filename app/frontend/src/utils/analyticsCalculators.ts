import { 
  parseISO, 
  format, 
  differenceInMinutes,
  eachDayOfInterval,
  getHours,
  isSameDay,
  differenceInHours
} from 'date-fns';
import { Booking } from '../types/booking.types';
import { Room } from '../types/room.types';
import { 
  KPIMetrics, 
  HourlyUtilization, 
  DailyTrend, 
  RoomLeaderboard,
  DateRange 
} from '../types/analytics.types';
import { clipToWorkHours, isBookingInRange, getWorkMinutesPerDay } from './dateUtils';

/**
 * Calculate overall utilization rate
 * Utilization = (Total booked minutes clipped to work hours) / (Total available minutes)
 */
export const calculateUtilization = (
  bookings: Booking[],
  rooms: Room[],
  dateRange: DateRange,
  workHours: { start: string; end: string }
): number => {
  const activeRooms = rooms.filter((r) => r.isActive);
  if (activeRooms.length === 0) return 0;

  // Get bookings within date range
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));

  // Calculate total booked minutes (clipped to work hours)
  const totalBookedMinutes = bookingsInRange.reduce((sum, booking) => {
    return sum + clipToWorkHours(booking.start, booking.end, workHours);
  }, 0);

  // Calculate total available minutes
  const days = eachDayOfInterval(dateRange);
  const workMinutesPerDay = getWorkMinutesPerDay(workHours);
  const totalAvailableMinutes = days.length * activeRooms.length * workMinutesPerDay;

  if (totalAvailableMinutes === 0) return 0;

  return (totalBookedMinutes / totalAvailableMinutes) * 100;
};

/**
 * Find the peak hour (busiest hour in the date range)
 */
export const findPeakHour = (
  bookings: Booking[],
  dateRange: DateRange
): string => {
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));

  if (bookingsInRange.length === 0) return 'N/A';

  // Count bookings per hour
  const hourCounts: Record<number, number> = {};

  bookingsInRange.forEach((booking) => {
    const start = parseISO(booking.start);
    const end = parseISO(booking.end);
    const startHour = getHours(start);
    const endHour = getHours(end);

    for (let hour = startHour; hour <= endHour; hour++) {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
  });

  // Find hour with max count
  const maxHour = Object.entries(hourCounts).reduce(
    (max, [hour, count]) => (count > max.count ? { hour: Number(hour), count } : max),
    { hour: 0, count: 0 }
  );

  return `${maxHour.hour.toString().padStart(2, '0')}:00`;
};

/**
 * Calculate average meeting length in minutes
 */
export const calculateAverageMeetingLength = (
  bookings: Booking[],
  dateRange: DateRange
): number => {
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));

  if (bookingsInRange.length === 0) return 0;

  const totalMinutes = bookingsInRange.reduce((sum, booking) => {
    const start = parseISO(booking.start);
    const end = parseISO(booking.end);
    return sum + differenceInMinutes(end, start);
  }, 0);

  return Math.round(totalMinutes / bookingsInRange.length);
};

/**
 * Get hourly heatmap data
 */
export const getHourlyHeatmap = (
  bookings: Booking[],
  rooms: Room[],
  dateRange: DateRange,
  workHours: { start: string; end: string }
): HourlyUtilization[] => {
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));
  const days = eachDayOfInterval(dateRange);
  const activeRooms = rooms.filter((r) => r.isActive);
  const [startHour] = workHours.start.split(':').map(Number);
  const [endHour] = workHours.end.split(':').map(Number);

  const heatmapData: HourlyUtilization[] = [];

  days.forEach((day) => {
    for (let hour = startHour; hour < endHour; hour++) {
      const dayStr = format(day, 'yyyy-MM-dd');
      const hourStart = parseISO(`${dayStr}T${hour.toString().padStart(2, '0')}:00:00`);
      const hourEnd = parseISO(`${dayStr}T${(hour + 1).toString().padStart(2, '0')}:00:00`);

      // Count how many rooms are booked during this hour
      const bookedRooms = new Set<string>();
      
      bookingsInRange.forEach((booking) => {
        const bookingStart = parseISO(booking.start);
        const bookingEnd = parseISO(booking.end);

        // Check if booking overlaps with this hour
        if (bookingStart < hourEnd && bookingEnd > hourStart) {
          bookedRooms.add(booking.roomId);
        }
      });

      const utilization = activeRooms.length > 0 
        ? (bookedRooms.size / activeRooms.length) * 100 
        : 0;

      heatmapData.push({
        day: dayStr,
        hour,
        utilization,
      });
    }
  });

  return heatmapData;
};

/**
 * Get daily trend data
 */
export const getDailyTrend = (
  bookings: Booking[],
  dateRange: DateRange,
  workHours: { start: string; end: string }
): DailyTrend[] => {
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));
  const days = eachDayOfInterval(dateRange);

  return days.map((day) => {
    const dayBookings = bookingsInRange.filter((booking) =>
      isSameDay(parseISO(booking.start), day)
    );

    const occupiedMinutes = dayBookings.reduce((sum, booking) => {
      return sum + clipToWorkHours(booking.start, booking.end, workHours);
    }, 0);

    return {
      date: format(day, 'yyyy-MM-dd'),
      meetings: dayBookings.length,
      occupiedMinutes,
    };
  });
};

/**
 * Get room leaderboard (most booked rooms)
 */
export const getRoomLeaderboard = (
  bookings: Booking[],
  rooms: Room[],
  dateRange: DateRange,
  workHours: { start: string; end: string }
): RoomLeaderboard[] => {
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));
  const days = eachDayOfInterval(dateRange);
  const workMinutesPerDay = getWorkMinutesPerDay(workHours);

  const roomStats: Record<string, { bookedMinutes: number; availableMinutes: number }> = {};

  rooms.forEach((room) => {
    const roomBookings = bookingsInRange.filter((b) => b.roomId === room.id);
    const bookedMinutes = roomBookings.reduce((sum, booking) => {
      return sum + clipToWorkHours(booking.start, booking.end, workHours);
    }, 0);

    const availableMinutes = room.isActive ? days.length * workMinutesPerDay : 0;

    roomStats[room.id] = {
      bookedMinutes,
      availableMinutes,
    };
  });

  return rooms
    .map((room) => {
      const stats = roomStats[room.id];
      const utilizationRate = stats.availableMinutes > 0
        ? (stats.bookedMinutes / stats.availableMinutes) * 100
        : 0;

      return {
        roomId: room.id,
        roomName: room.name,
        bookedMinutes: stats.bookedMinutes,
        utilizationRate,
      };
    })
    .sort((a, b) => b.bookedMinutes - a.bookedMinutes);
};

/**
 * Calculate all KPI metrics
 */
export const calculateKPIMetrics = (
  bookings: Booking[],
  rooms: Room[],
  dateRange: DateRange,
  workHours: { start: string; end: string }
): KPIMetrics => {
  const activeRooms = rooms.filter((r) => r.isActive);
  const now = new Date();

  // Available now
  const busyRoomIds = new Set(
    bookings
      .filter((b) => {
        const start = parseISO(b.start);
        const end = parseISO(b.end);
        return now >= start && now < end;
      })
      .map((b) => b.roomId)
  );

  const availableNow = activeRooms.filter((r) => !busyRoomIds.has(r.id)).length;

  // Utilization rate
  const utilizationRate = calculateUtilization(bookings, rooms, dateRange, workHours);

  // Peak hour
  const peakHour = findPeakHour(bookings, dateRange);

  // Average meeting length
  const avgMeetingLength = calculateAverageMeetingLength(bookings, dateRange);

  // Top room
  const leaderboard = getRoomLeaderboard(bookings, rooms, dateRange, workHours);
  const topRoom = leaderboard.length > 0 && leaderboard[0].bookedMinutes > 0
    ? {
        name: leaderboard[0].roomName,
        minutes: leaderboard[0].bookedMinutes,
      }
    : null;

  return {
    utilizationRate,
    availableNow,
    totalActiveRooms: activeRooms.length,
    peakHour,
    avgMeetingLength,
    topRoom,
  };
};

/**
 * Calculate lead time distribution
 */
export const getLeadTimeDistribution = (
  bookings: Booking[],
  dateRange: DateRange
): { range: string; count: number }[] => {
  const bookingsInRange = bookings.filter((b) => isBookingInRange(b, dateRange));

  const distribution: Record<string, number> = {
    '0-1h': 0,
    '1-6h': 0,
    '6-24h': 0,
    '1-7d': 0,
    '>7d': 0,
  };

  bookingsInRange.forEach((booking) => {
    const created = parseISO(booking.createdAt);
    const start = parseISO(booking.start);
    const leadTimeHours = differenceInHours(start, created);

    if (leadTimeHours < 1) {
      distribution['0-1h']++;
    } else if (leadTimeHours < 6) {
      distribution['1-6h']++;
    } else if (leadTimeHours < 24) {
      distribution['6-24h']++;
    } else if (leadTimeHours < 168) {
      distribution['1-7d']++;
    } else {
      distribution['>7d']++;
    }
  });

  return Object.entries(distribution).map(([range, count]) => ({ range, count }));
};

