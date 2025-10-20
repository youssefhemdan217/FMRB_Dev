export enum UserRole {
  ADMIN = 'admin',
  APPROVAL = 'approval',
  USER = 'user',
}

export interface User {
  id: string;
  email: string;
  password: string; // Hashed
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface UserUpdateData {
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
}

