export interface Booking {
  id: string;
  roomId: string;
  title: string;
  organizer?: string;
  start: Date;
  end: Date;
  createdAt: Date;
}

export interface BookingCreateData {
  roomId: string;
  title: string;
  organizer?: string;
  start: Date;
  end: Date;
}

export interface BookingUpdateData {
  title?: string;
  organizer?: string;
  start?: Date;
  end?: Date;
}

