import { Room, RoomCreateData, RoomUpdateData } from '../entities/Room';

export interface IRoomRepository {
  create(data: RoomCreateData): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  update(id: string, data: RoomUpdateData): Promise<Room>;
  delete(id: string): Promise<void>;
}

