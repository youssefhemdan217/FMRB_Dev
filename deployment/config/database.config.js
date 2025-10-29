"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDatabaseConnection = exports.getDatabasePool = exports.databaseConfig = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_config_1 = require("./env.config");
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
    const environment = env_config_1.env.DB_ENVIRONMENT || 'local';
    if (environment === 'production') {
        console.log('🏢 Using production database configuration');
        return databaseConfigs.production;
    }
    else {
        console.log('🏠 Using local database configuration');
        return databaseConfigs.local;
    }
};
exports.databaseConfig = getDatabaseConfig();
let pool;
const getDatabasePool = () => {
    if (!pool) {
        pool = promise_1.default.createPool(exports.databaseConfig);
    }
    return pool;
};
exports.getDatabasePool = getDatabasePool;
const testDatabaseConnection = async () => {
    try {
        const connection = await (0, exports.getDatabasePool)().getConnection();
        console.log('✅ MySQL Connected Successfully!');
        connection.release();
    }
    catch (error) {
        console.error('❌ MySQL Connection Failed:', error);
        throw error;
    }
};
exports.testDatabaseConnection = testDatabaseConnection;
//# sourceMappingURL=database.config.js.map