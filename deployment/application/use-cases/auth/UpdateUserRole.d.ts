import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserRole } from '../../../domain/entities/User';
export interface UpdateUserRoleDTO {
    userId: string;
    role: UserRole;
}
export declare class UpdateUserRoleUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: UpdateUserRoleDTO): Promise<{
        message: string;
        user: any;
    }>;
}
//# sourceMappingURL=UpdateUserRole.d.ts.map