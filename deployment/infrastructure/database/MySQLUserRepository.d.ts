import { Pool } from 'mysql2/promise';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User, UserCreateData, UserUpdateData, UserRole } from '../../domain/entities/User';
export declare class MySQLUserRepository implements IUserRepository {
    private pool;
    constructor(pool: Pool);
    create(data: UserCreateData): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: UserUpdateData): Promise<User>;
    updateRole(id: string, role: UserRole): Promise<User>;
    delete(id: string): Promise<void>;
    private mapRowToUser;
}
//# sourceMappingURL=MySQLUserRepository.d.ts.map