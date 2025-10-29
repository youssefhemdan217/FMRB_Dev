import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Room } from '../../../domain/entities/Room';
import { CreateRoomDTO } from '../../dtos/RoomDTO';
export declare class CreateRoomUseCase {
    private roomRepository;
    constructor(roomRepository: IRoomRepository);
    execute(data: CreateRoomDTO): Promise<Room>;
}
//# sourceMappingURL=CreateRoom.d.ts.map