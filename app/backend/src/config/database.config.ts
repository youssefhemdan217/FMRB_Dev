import mysql from 'mysql2/promise';
import { env } from './env.config';

// Database configurations for different environments
const databaseConfigs = {
  local: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'fmrb_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    jsonStrings: false,
  },
  production: {
    host: 'SPMWSM02X3ZD.saipemnet.saipem.intranet',
    port: 3306,
    user: 'user',
    password: 'Fabsi@1234',
    database: 'fmrb_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    jsonStrings: false,
    ssl: false, // SslMode=None equivalent
  }
};

// Get the appropriate database config based on environment
const getDatabaseConfig = () => {
  const environment = env.DB_ENVIRONMENT || 'local';
  
  if (environment === 'production') {
    console.log('🏢 Using production database configuration');
    return databaseConfigs.production;
  } else {
    console.log('🏠 Using local database configuration');
    return databaseConfigs.local;
  }
};

export const databaseConfig = getDatabaseConfig();

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

