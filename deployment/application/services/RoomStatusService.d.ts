import { Room } from '../../domain/entities/Room';
import { Booking } from '../../domain/entities/Booking';
export type RoomStatus = 'available' | 'busy' | 'unavailable';
export interface RoomStatusInfo {
    status: RoomStatus;
    statusMessage: string;
    nextChange?: string;
}
export declare class RoomStatusService {
    /**
     * Calculate the current status of a room based on its bookings
     */
    calculateStatus(room: Room, bookings: Booking[]): RoomStatusInfo;
}
//# sourceMappingURL=RoomStatusService.d.ts.map