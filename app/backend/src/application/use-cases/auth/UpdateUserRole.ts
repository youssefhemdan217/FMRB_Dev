import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserRole } from '../../../domain/entities/User';
import { NotFoundError } from '../../../domain/errors/DomainErrors';

export interface UpdateUserRoleDTO {
  userId: string;
  role: UserRole;
}

export class UpdateUserRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: UpdateUserRoleDTO): Promise<{ message: string; user: any }> {
    const user = await this.userRepository.findById(dto.userId);
    
    if (!user) {
      throw new NotFoundError('User', dto.userId);
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

