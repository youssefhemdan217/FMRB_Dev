"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRoleUseCase = void 0;
const DomainErrors_1 = require("../../../domain/errors/DomainErrors");
class UpdateUserRoleUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(dto) {
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new DomainErrors_1.NotFoundError('User', dto.userId);
        }
        // Update user role
        const updatedUser = await this.userRepository.updateRole(dto.userId, dto.role);
        return {
            message: `User role updated to ${dto.role} successfully`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
            },
        };
    }
}
exports.UpdateUserRoleUseCase = UpdateUserRoleUseCase;
//# sourceMappingURL=UpdateUserRole.js.map