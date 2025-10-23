import { Pool, RowDataPacket } from 'mysql2/promise';
import { IBookingRepository } from '../../domain/interfaces/IBookingRepository';
import { Booking, BookingCreateData, BookingUpdateData } from '../../domain/entities/Booking';

export class MySQLBookingRepository implements IBookingRepository {
  constructor(private pool: Pool) {}

  async create(data: BookingCreateData): Promise<Booking> {
    const [result] = await this.pool.execute(
      `INSERT INTO mb_bookings (room_id, title, organizer, start, end, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.roomId, data.title, data.organizer || null, data.start, data.end, data.status || 'pending']
    );

    const insertId = (result as any).insertId;
    const booking = await this.findById(insertId.toString());
    return booking!;
  }

  async findById(id: string): Promise<Booking | null> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM mb_bookings WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return this.mapRowToBooking(rows[0]);
  }

  async findAll(): Promise<Booking[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM mb_bookings ORDER BY start ASC`
    );
    return rows.map(this.mapRowToBooking);
  }

  async findByRoomId(roomId: string): Promise<Booking[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM mb_bookings WHERE room_id = ? ORDER BY start ASC`,
      [roomId]
    );
    return rows.map(this.mapRowToBooking);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT * FROM mb_bookings WHERE user_id = ? ORDER BY start ASC`,
      [userId]
    );
    return rows.map(this.mapRowToBooking);
  }

  async findOverlapping(roomId: string, start: Date, end: Date, excludeId?: string): Promise<Booking[]> {
    // Block overlaps against pending and approved bookings only
    let sql = `SELECT * FROM mb_bookings WHERE room_id = ? AND start < ? AND end > ? AND status IN ('pending','approved')`;
    const params: any[] = [roomId, end, start];

    if (excludeId) {
      sql += ` AND id != ?`;
      params.push(excludeId);
    }

    const [rows] = await this.pool.execute<RowDataPacket[]>(sql, params);
    return rows.map(this.mapRowToBooking);
  }

  async update(id: string, data: BookingUpdateData): Promise<Booking> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.organizer !== undefined) {
      updates.push('organizer = ?');
      values.push(data.organizer);
    }
    if (data.start !== undefined) {
      updates.push('start = ?');
      values.push(data.start);
    }
    if (data.end !== undefined) {
      updates.push('end = ?');
      values.push(data.end);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }

    values.push(id);

    if (updates.length > 0) {
      await this.pool.execute(
        `UPDATE mb_bookings SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    const booking = await this.findById(id);
    return booking!;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM mb_bookings WHERE id = ?`, [id]);
  }

  private mapRowToBooking(row: RowDataPacket): Booking {
    return {
      id: row.id.toString(),
      roomId: row.room_id.toString(),
      userId: row.user_id ? row.user_id.toString() : undefined,
      title: row.title,
      organizer: row.organizer || undefined,
      start: new Date(row.start),
      end: new Date(row.end),
      status: row.status as any,
      createdAt: new Date(row.created_at),
    };
  }
}

