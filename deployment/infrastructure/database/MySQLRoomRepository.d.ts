import { Pool } from 'mysql2/promise';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import { Room, RoomCreateData, RoomUpdateData } from '../../domain/entities/Room';
export declare class MySQLRoomRepository implements IRoomRepository {
    private pool;
    constructor(pool: Pool);
    create(data: RoomCreateData): Promise<Room>;
    findById(id: string): Promise<Room | null>;
    findAll(): Promise<Room[]>;
    update(id: string, data: RoomUpdateData): Promise<Room>;
    delete(id: string): Promise<void>;
    private mapRowToRoom;
}
//# sourceMappingURL=MySQLRoomRepository.d.ts.map