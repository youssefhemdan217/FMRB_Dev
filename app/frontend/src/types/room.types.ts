export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  workHours: {
    start: string; // "08:00"
    end: string; // "20:00"
  };
  amenities?: string[];
}

export type RoomStatus = 'available' | 'busy' | 'unavailable';

export interface RoomWithStatus extends Room {
  status: RoomStatus;
  statusMessage: string;
  nextChange?: string;
}

