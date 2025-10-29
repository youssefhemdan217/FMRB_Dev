"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllRoomsUseCase = void 0;
class GetAllRoomsUseCase {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute() {
        return this.roomRepository.findAll();
    }
}
exports.GetAllRoomsUseCase = GetAllRoomsUseCase;
//# sourceMappingURL=GetAllRooms.js.map