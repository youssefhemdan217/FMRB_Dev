import { Pool, RowDataPacket } from 'mysql2/promise';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User, UserCreateData, UserUpdateData, UserRole } from '../../domain/entities/User';

export class MySQLUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async create(data: UserCreateData): Promise<User> {
    const [result] = await this.pool.execute(
      `INSERT INTO mb_users (email, password, name, role, is_active) VALUES (?, ?, ?, ?, ?)`,
      [data.email, data.password, data.name, data.role || UserRole.USER, true]
    );

    const insertId = (result as any).insertId;
    const user = await this.findById(insertId.toString());
    return user!;
  }

  async findById(id: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM mb_users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return this.mapRowToUser(rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM mb_users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) return null;
    return this.mapRowToUser(rows[0]);
  }

  async findAll(): Promise<User[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(`SELECT * FROM mb_users`);
    return rows.map(this.mapRowToUser);
  }

  async update(id: string, data: UserUpdateData): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.role !== undefined) {
      updates.push('role = ?');
      values.push(data.role);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(data.isActive);
    }

    values.push(id);

    if (updates.length > 0) {
      await this.pool.execute(
        `UPDATE mb_users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );
    }

    const user = await this.findById(id);
    return user!;
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    await this.pool.execute(
      `UPDATE mb_users SET role = ?, updated_at = NOW() WHERE id = ?`,
      [role, id]
    );

    const user = await this.findById(id);
    return user!;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM mb_users WHERE id = ?`, [id]);
  }

  private mapRowToUser(row: RowDataPacket): User {
    return {
      id: row.id.toString(),
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role as UserRole,
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

