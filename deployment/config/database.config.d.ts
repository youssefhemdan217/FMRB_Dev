import mysql from 'mysql2/promise';
export declare const databaseConfig: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
    jsonStrings: boolean;
};
export declare const getDatabasePool: () => mysql.Pool;
export declare const testDatabaseConnection: () => Promise<void>;
//# sourceMappingURL=database.config.d.ts.map