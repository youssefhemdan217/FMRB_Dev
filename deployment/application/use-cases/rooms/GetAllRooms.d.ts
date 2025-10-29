import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Room } from '../../../domain/entities/Room';
export declare class GetAllRoomsUseCase {
    private roomRepository;
    constructor(roomRepository: IRoomRepository);
    execute(): Promise<Room[]>;
}
//# sourceMappingURL=GetAllRooms.d.ts.map