import { Request, Response, NextFunction } from 'express';
import { CreateRoomUseCase } from '../../application/use-cases/rooms/CreateRoom';
import { GetAllRoomsUseCase } from '../../application/use-cases/rooms/GetAllRooms';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import { IBookingRepository } from '../../domain/interfaces/IBookingRepository';
import { RoomStatusService } from '../../application/services/RoomStatusService';
export declare class RoomController {
    private createRoomUseCase;
    private getAllRoomsUseCase;
    private roomRepository;
    private bookingRepository;
    private roomStatusService;
    constructor(createRoomUseCase: CreateRoomUseCase, getAllRoomsUseCase: GetAllRoomsUseCase, roomRepository: IRoomRepository, bookingRepository: IBookingRepository, roomStatusService: RoomStatusService);
    getAll: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=RoomController.d.ts.map