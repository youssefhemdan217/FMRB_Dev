import { IBookingRepository } from '../../../domain/interfaces/IBookingRepository';
import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { RoomStatusService } from '../../services/RoomStatusService';
export interface AnalyticsSummaryDTO {
    utilization: number;
    availableRooms: number;
    totalRooms: number;
    peakHour: string;
    avgMeetingDuration: number;
    topRoom: {
        name: string;
        bookedTime: string;
    } | null;
}
export declare class GetAnalyticsSummaryUseCase {
    private bookingRepository;
    private roomRepository;
    private roomStatusService;
    constructor(bookingRepository: IBookingRepository, roomRepository: IRoomRepository, roomStatusService: RoomStatusService);
    execute(startDate: Date, endDate: Date, roomId?: string): Promise<AnalyticsSummaryDTO>;
    private calculateTotalAvailableMinutes;
    private calculateBookedMinutes;
    private calculatePeakHour;
    private findTopRoom;
}
//# sourceMappingURL=GetAnalyticsSummary.d.ts.map