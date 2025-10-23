export interface CreateBookingDTO {
  roomId: string;
  title: string;
  organizer?: string;
  start: string; // ISO string
  end: string;   // ISO string
}

export interface UpdateBookingDTO {
  title?: string;
  organizer?: string;
  start?: string;
  end?: string;
  status?: 'pending' | 'approved' | 'declined';
}

export interface BookingResponseDTO {
  id: string;
  roomId: string;
  userId?: string;
  title: string;
  organizer?: string;
  start: string;
  end: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

