"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomUseCase = void 0;
const DomainErrors_1 = require("../../../domain/errors/DomainErrors");
class CreateRoomUseCase {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(data) {
        // Validate input
        if (!data.name || !data.location || !data.capacity) {
            throw new DomainErrors_1.ValidationError('Name, location, and capacity are required');
        }
        if (data.capacity < 1) {
            throw new DomainErrors_1.ValidationError('Capacity must be at least 1');
        }
        if (!data.workHours || !data.workHours.start || !data.workHours.end) {
            throw new DomainErrors_1.ValidationError('Work hours are required');
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
exports.CreateRoomUseCase = CreateRoomUseCase;
//# sourceMappingURL=CreateRoom.js.map