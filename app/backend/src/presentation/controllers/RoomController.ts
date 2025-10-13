import { Request, Response, NextFunction } from 'express';
import { CreateRoomUseCase } from '../../application/use-cases/rooms/CreateRoom';
import { GetAllRoomsUseCase } from '../../application/use-cases/rooms/GetAllRooms';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import { IBookingRepository } from '../../domain/interfaces/IBookingRepository';
import { RoomStatusService } from '../../application/services/RoomStatusService';
import { NotFoundError } from '../../domain/errors/DomainErrors';

export class RoomController {
  constructor(
    private createRoomUseCase: CreateRoomUseCase,
    private getAllRoomsUseCase: GetAllRoomsUseCase,
    private roomRepository: IRoomRepository,
    private bookingRepository: IBookingRepository,
    private roomStatusService: RoomStatusService
  ) {}

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const rooms = await this.getAllRoomsUseCase.execute();
      const allBookings = await this.bookingRepository.findAll();
      
      // Map to response format with status
      const response = rooms.map(room => {
        const roomBookings = allBookings.filter(b => b.roomId === room.id);
        const statusInfo = this.roomStatusService.calculateStatus(room, roomBookings);
        
        return {
          id: room.id,
          name: room.name,
          location: room.location,
          capacity: room.capacity,
          isActive: room.isActive,
          workHours: room.workHours,
          amenities: room.amenities,
          status: statusInfo.status,
          statusMessage: statusInfo.statusMessage,
          nextChange: statusInfo.nextChange,
        };
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const room = await this.roomRepository.findById(req.params.id);
      if (!room) {
        throw new NotFoundError('Room', req.params.id);
      }
      res.json({
        id: room.id,
        name: room.name,
        location: room.location,
        capacity: room.capacity,
        isActive: room.isActive,
        workHours: room.workHours,
        amenities: room.amenities,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const room = await this.createRoomUseCase.execute(req.body);
      res.status(201).json({
        id: room.id,
        name: room.name,
        location: room.location,
        capacity: room.capacity,
        isActive: room.isActive,
        workHours: room.workHours,
        amenities: room.amenities,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const room = await this.roomRepository.update(req.params.id, req.body);
      res.json({
        id: room.id,
        name: room.name,
        location: room.location,
        capacity: room.capacity,
        isActive: room.isActive,
        workHours: room.workHours,
        amenities: room.amenities,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.roomRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

