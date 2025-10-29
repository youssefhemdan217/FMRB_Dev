"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLUserRepository = void 0;
const User_1 = require("../../domain/entities/User");
class MySQLUserRepository {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const [result] = await this.pool.execute(`INSERT INTO mb_users (email, password, name, role, is_active) VALUES (?, ?, ?, ?, ?)`, [data.email, data.password, data.name, data.role || User_1.UserRole.USER, true]);
        const insertId = result.insertId;
        const user = await this.findById(insertId.toString());
        return user;
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_users WHERE id = ?`, [id]);
        if (rows.length === 0)
            return null;
        return this.mapRowToUser(rows[0]);
    }
    async findByEmail(email) {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_users WHERE email = ?`, [email]);
        if (rows.length === 0)
            return null;
        return this.mapRowToUser(rows[0]);
    }
    async findAll() {
        const [rows] = await this.pool.execute(`SELECT * FROM mb_users`);
        return rows.map(this.mapRowToUser);
    }
    async update(id, data) {
        const updates = [];
        const values = [];
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
            await this.pool.execute(`UPDATE mb_users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values);
        }
        const user = await this.findById(id);
        return user;
    }
    async updateRole(id, role) {
        await this.pool.execute(`UPDATE mb_users SET role = ?, updated_at = NOW() WHERE id = ?`, [role, id]);
        const user = await this.findById(id);
        return user;
    }
    async delete(id) {
        await this.pool.execute(`DELETE FROM mb_users WHERE id = ?`, [id]);
    }
    mapRowToUser(row) {
        return {
            id: row.id.toString(),
            email: row.email,
            password: row.password,
            name: row.name,
            role: row.role,
            isActive: Boolean(row.is_active),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
exports.MySQLUserRepository = MySQLUserRepository;
//# sourceMappingURL=MySQLUserRepository.js.map