export interface CreateRoomDTO {
  name: string;
  location: string;
  capacity: number;
  isActive?: boolean;
  workHours: {
    start: string;
    end: string;
  };
  amenities?: string[];
}

export interface UpdateRoomDTO {
  name?: string;
  location?: string;
  capacity?: number;
  isActive?: boolean;
  workHours?: {
    start?: string;
    end?: string;
  };
  amenities?: string[];
}

export interface RoomResponseDTO {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  workHours: {
    start: string;
    end: string;
  };
  amenities?: string[];
}

