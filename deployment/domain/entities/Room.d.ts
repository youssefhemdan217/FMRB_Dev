export interface Room {
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
    createdAt: Date;
    updatedAt: Date;
}
export interface RoomCreateData {
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
export interface RoomUpdateData {
    name?: string;
    location?: string;
    capacity?: number;
    isActive?: boolean;
    workHours?: {
        start: string;
        end: string;
    };
    amenities?: string[];
}
//# sourceMappingURL=Room.d.ts.map