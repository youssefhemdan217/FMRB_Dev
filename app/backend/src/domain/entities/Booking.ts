export interface Booking {
  id: string;
  roomId: string;
  userId?: string;
  title: string;
  organizer?: string;
  start: Date;
  end: Date;
  status: 'pending' | 'approved' | 'declined';
  createdAt: Date;
}

export interface BookingCreateData {
  roomId: string;
  title: string;
  organizer?: string;
  start: Date;
  end: Date;
  status?: 'pending' | 'approved' | 'declined';
}

export interface BookingUpdateData {
  title?: string;
  organizer?: string;
  start?: Date;
  end?: Date;
  status?: 'pending' | 'approved' | 'declined';
}

