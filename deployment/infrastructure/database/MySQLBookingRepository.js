"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLBookingRepository = void 0;
class MySQLBookingRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const [result] = await this.pool.execute(`INSERT INTO mb_bookings (room_id, title, organizer, start, end, status) 
       VALUES (?, ?, ?, ?, ?, ?)`, [data.roomId, data.title, data.organizer || null, data.start, data.end, data.status || 'pending']);
        const insertId = result.insertId;
        const booking = await this.findById(insertId.toString());
        return booking;
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_bookings WHERE id = ?`, [id]);
        if (rows.length === 0)
            return null;
        return this.mapRowToBooking(rows[0]);
    }
    async findAll() {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_bookings ORDER BY start ASC`);
        return rows.map(this.mapRowToBooking);
    }
    async findByRoomId(roomId) {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_bookings WHERE room_id = ? ORDER BY start ASC`, [roomId]);
        return rows.map(this.mapRowToBooking);
    }
    async findByUserId(userId) {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_bookings WHERE user_id = ? ORDER BY start ASC`, [userId]);
        return rows.map(this.mapRowToBooking);
    }
    async findOverlapping(roomId, start, end, excludeId) {
        // Block overlaps against pending and approved bookings only
        let sql = `SELECT * FROM mb_bookings WHERE room_id = ? AND start < ? AND end > ? AND status IN ('pending','approved')`;
        const params = [roomId, end, start];
        if (excludeId) {
            sql += ` AND id != ?`;
            params.push(excludeId);
        }
        const [rows] = await this.pool.execute(sql, params);
        return rows.map(this.mapRowToBooking);
    }
    async update(id, data) {
        const updates = [];
        const values = [];
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
            await this.pool.execute(`UPDATE mb_bookings SET ${updates.join(', ')} WHERE id = ?`, values);
        }
        const booking = await this.findById(id);
        return booking;
    }
    async delete(id) {
        await this.pool.execute(`DELETE FROM mb_bookings WHERE id = ?`, [id]);
    }
    mapRowToBooking(row) {
        return {
            id: row.id.toString(),
            roomId: row.room_id.toString(),
            userId: row.user_id ? row.user_id.toString() : undefined,
            title: row.title,
            organizer: row.organizer || undefined,
            start: new Date(row.start),
            end: new Date(row.end),
            status: row.status,
            createdAt: new Date(row.created_at),
        };
    }
}
exports.MySQLBookingRepository = MySQLBookingRepository;
//# sourceMappingURL=MySQLBookingRepository.js.map