import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Room } from '../../../domain/entities/Room';

export class GetAllRoomsUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }
}

