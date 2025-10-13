import { User, UserCreateData, UserUpdateData } from '../entities/User';

export interface IUserRepository {
  create(data: UserCreateData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UserUpdateData): Promise<User>;
  delete(id: string): Promise<void>;
}

