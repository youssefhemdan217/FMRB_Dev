import { Pool, RowDataPacket } from 'mysql2/promise';
import { IRoomRepository } from '../../domain/interfaces/IRoomRepository';
import { Room, RoomCreateData, RoomUpdateData } from '../../domain/entities/Room';

export class MySQLRoomRepository implements IRoomRepository {
  constructor(private pool: Pool) {}

  async create(data: RoomCreateData): Promise<Room> {
    const [result] = await this.pool.execute(
      `INSERT INTO rooms (name, location, capacity, is_active, work_hours_start, work_hours_end, amenities) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.location,
        data.capacity,
        data.isActive !== undefined ? data.isActive : true,
        data.workHours.start,
        data.workHours.end,
        data.amenities ? JSON.stringify(data.amenities) : null,
      ]
    );

    const insertId = (result as any).insertId;
    const room = await this.findById(insertId.toString());
    return room!;
  }

  async findById(id: string): Promise<Room | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM rooms WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return this.mapRowToRoom(rows[0]);
  }

  async findAll(): Promise<Room[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM rooms ORDER BY name`
    );
    return rows.map(this.mapRowToRoom);
  }

  async update(id: string, data: RoomUpdateData): Promise<Room> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.location !== undefined) {
      updates.push('location = ?');
      values.push(data.location);
    }
    if (data.capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(data.capacity);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(data.isActive);
    }
    if (data.workHours?.start) {
      updates.push('work_hours_start = ?');
      values.push(data.workHours.start);
    }
    if (data.workHours?.end) {
      updates.push('work_hours_end = ?');
      values.push(data.workHours.end);
    }
    if (data.amenities !== undefined) {
      updates.push('amenities = ?');
      values.push(JSON.stringify(data.amenities));
    }

    values.push(id);

    if (updates.length > 0) {
      await this.pool.execute(
        `UPDATE rooms SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
        values
      );
    }

    const room = await this.findById(id);
    return room!;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM rooms WHERE id = ?`, [id]);
  }

  private mapRowToRoom(row: RowDataPacket): Room {
    // With jsonStrings: false, MySQL returns JSON columns as JavaScript objects
    // Amenities will be an array or null
    const amenities: string[] = Array.isArray(row.amenities) ? row.amenities : [];

    return {
      id: row.id.toString(),
      name: row.name,
      location: row.location,
      capacity: row.capacity,
      isActive: Boolean(row.is_active),
      workHours: {
        start: row.work_hours_start.slice(0, 5),
        end: row.work_hours_end.slice(0, 5),
      },
      amenities,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

