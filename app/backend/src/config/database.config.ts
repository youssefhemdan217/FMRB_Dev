import mysql from 'mysql2/promise';
import { env } from './env.config';

export const databaseConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool;

export const getDatabasePool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool(databaseConfig);
  }
  return pool;
};

export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await getDatabasePool().getConnection();
    console.log('✅ MySQL Connected Successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error);
    throw error;
  }
};

