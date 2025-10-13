export interface Booking {
  id: string;
  roomId: string;
  title: string;
  organizer?: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
  createdAt: string; // ISO 8601
}

export interface BookingFormData {
  title: string;
  organizer?: string;
  start: string;
  end: string;
}

export interface BookingValidationErrors {
  title?: string;
  start?: string;
  end?: string;
  overlap?: string;
}

