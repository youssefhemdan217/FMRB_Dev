import { Room } from '../types/room.types';
import { Booking } from '../types/booking.types';
import { addDays, addHours, startOfToday, format } from 'date-fns';

/**
 * Generate mock rooms
 */
export const generateMockRooms = (): Room[] => {
  return [
    {
      id: 'room-1',
      name: 'Conference Room A',
      location: 'Floor 1, Wing A',
      capacity: 10,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Projector', 'Whiteboard', 'Video Conference'],
    },
    {
      id: 'room-2',
      name: 'Meeting Room B',
      location: 'Floor 1, Wing B',
      capacity: 6,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Whiteboard', 'TV Screen'],
    },
    {
      id: 'room-3',
      name: 'Executive Suite',
      location: 'Floor 2, Wing A',
      capacity: 12,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Projector', 'Video Conference', 'Conference Phone', 'Whiteboard'],
    },
    {
      id: 'room-4',
      name: 'Small Meeting Room C',
      location: 'Floor 2, Wing B',
      capacity: 4,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['TV Screen'],
    },
    {
      id: 'room-5',
      name: 'Training Room',
      location: 'Floor 3, Wing A',
      capacity: 20,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Projector', 'Whiteboard', 'Video Conference', 'Sound System'],
    },
    {
      id: 'room-6',
      name: 'Board Room',
      location: 'Floor 3, Wing B',
      capacity: 15,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Large Screen', 'Video Conference', 'Conference Phone'],
    },
    {
      id: 'room-7',
      name: 'Huddle Room 1',
      location: 'Floor 1, Wing C',
      capacity: 4,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Whiteboard'],
    },
    {
      id: 'room-8',
      name: 'Innovation Lab',
      location: 'Floor 2, Wing C',
      capacity: 8,
      isActive: false, // Inactive for testing
      workHours: { start: '08:00', end: '20:00' },
      amenities: ['Whiteboard', 'Projector'],
    },
    {
      id: 'room-9',
      name: 'Team Room Alpha',
      location: 'Floor 3, Wing C',
      capacity: 8,
      isActive: true,
      workHours: { start: '09:00', end: '18:00' },
      amenities: ['TV Screen', 'Whiteboard'],
    },
    {
      id: 'room-10',
      name: 'Focus Room',
      location: 'Floor 1, Wing D',
      capacity: 2,
      isActive: true,
      workHours: { start: '08:00', end: '20:00' },
      amenities: [],
    },
  ];
};

/**
 * Generate mock bookings
 */
export const generateMockBookings = (rooms: Room[]): Booking[] => {
  const bookings: Booking[] = [];
  const today = startOfToday();
  const activeRooms = rooms.filter((r) => r.isActive);

  let bookingCounter = 1;

  // Generate bookings for the last 7 days and next 7 days
  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const day = addDays(today, dayOffset);
    const dateStr = format(day, 'yyyy-MM-dd');

    // For each day, create several bookings across different rooms
    activeRooms.forEach((room) => {
      // Morning meeting (9:00 - 10:00)
      if (Math.random() > 0.3) {
        const start = `${dateStr}T09:00:00`;
        const end = `${dateStr}T10:00:00`;
        bookings.push({
          id: `booking-${bookingCounter++}`,
          roomId: room.id,
          title: 'Morning Standup',
          organizer: 'Team Lead',
          start,
          end,
          createdAt: format(addDays(day, -2), "yyyy-MM-dd'T'HH:mm:ss"),
        });
      }

      // Mid-morning meeting (10:30 - 11:30)
      if (Math.random() > 0.5) {
        const start = `${dateStr}T10:30:00`;
        const end = `${dateStr}T11:30:00`;
        bookings.push({
          id: `booking-${bookingCounter++}`,
          roomId: room.id,
          title: 'Client Presentation',
          organizer: 'Sales Team',
          start,
          end,
          createdAt: format(addDays(day, -3), "yyyy-MM-dd'T'HH:mm:ss"),
        });
      }

      // Lunch meeting (12:00 - 13:00)
      if (Math.random() > 0.7) {
        const start = `${dateStr}T12:00:00`;
        const end = `${dateStr}T13:00:00`;
        bookings.push({
          id: `booking-${bookingCounter++}`,
          roomId: room.id,
          title: 'Lunch & Learn',
          organizer: 'HR Department',
          start,
          end,
          createdAt: format(addDays(day, -5), "yyyy-MM-dd'T'HH:mm:ss"),
        });
      }

      // Afternoon meeting (14:00 - 15:30)
      if (Math.random() > 0.4) {
        const start = `${dateStr}T14:00:00`;
        const end = `${dateStr}T15:30:00`;
        bookings.push({
          id: `booking-${bookingCounter++}`,
          roomId: room.id,
          title: 'Sprint Planning',
          organizer: 'Product Owner',
          start,
          end,
          createdAt: format(addDays(day, -1), "yyyy-MM-dd'T'HH:mm:ss"),
        });
      }

      // Late afternoon meeting (16:00 - 17:00)
      if (Math.random() > 0.6) {
        const start = `${dateStr}T16:00:00`;
        const end = `${dateStr}T17:00:00`;
        bookings.push({
          id: `booking-${bookingCounter++}`,
          roomId: room.id,
          title: 'Team Sync',
          organizer: 'Department Manager',
          start,
          end,
          createdAt: format(addDays(day, -1), "yyyy-MM-dd'T'HH:mm:ss"),
        });
      }
    });
  }

  // Add some longer meetings
  for (let i = 0; i < 5; i++) {
    const randomDay = addDays(today, Math.floor(Math.random() * 7) - 3);
    const dateStr = format(randomDay, 'yyyy-MM-dd');
    const randomRoom = activeRooms[Math.floor(Math.random() * activeRooms.length)];
    
    const start = `${dateStr}T13:00:00`;
    const end = `${dateStr}T17:00:00`;
    bookings.push({
      id: `booking-${bookingCounter++}`,
      roomId: randomRoom.id,
      title: 'All-Day Workshop',
      organizer: 'Training Coordinator',
      start,
      end,
      createdAt: format(addDays(randomDay, -7), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }

  // Add some bookings for today to test current status
  const todayStr = format(today, 'yyyy-MM-dd');
  const now = new Date();
  const currentHour = now.getHours();

  // Add a meeting happening right now for the first room
  if (activeRooms.length > 0) {
    const start = `${todayStr}T${currentHour.toString().padStart(2, '0')}:00:00`;
    const end = `${todayStr}T${(currentHour + 1).toString().padStart(2, '0')}:00:00`;
    bookings.push({
      id: `booking-${bookingCounter++}`,
      roomId: activeRooms[0].id,
      title: 'Current Meeting',
      organizer: 'Test User',
      start,
      end,
      createdAt: format(addHours(now, -2), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }

  return bookings;
};

/**
 * Generate initial mock data
 */
export const generateMockData = (): { rooms: Room[]; bookings: Booking[] } => {
  const rooms = generateMockRooms();
  const bookings = generateMockBookings(rooms);
  
  return { rooms, bookings };
};

