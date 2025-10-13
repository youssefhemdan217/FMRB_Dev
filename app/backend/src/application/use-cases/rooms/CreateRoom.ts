import { IRoomRepository } from '../../../domain/interfaces/IRoomRepository';
import { Room } from '../../../domain/entities/Room';
import { ValidationError } from '../../../domain/errors/DomainErrors';
import { CreateRoomDTO } from '../../dtos/RoomDTO';

export class CreateRoomUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(data: CreateRoomDTO): Promise<Room> {
    // Validate input
    if (!data.name || !data.location || !data.capacity) {
      throw new ValidationError('Name, location, and capacity are required');
    }

    if (data.capacity < 1) {
      throw new ValidationError('Capacity must be at least 1');
    }

    if (!data.workHours || !data.workHours.start || !data.workHours.end) {
      throw new ValidationError('Work hours are required');
    }

    // Create room
    return this.roomRepository.create({
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      isActive: data.isActive !== undefined ? data.isActive : true,
      workHours: data.workHours,
      amenities: data.amenities || [],
    });
  }
}

