"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load .env from the backend root directory
// In production (IIS), the working directory is usually the application root
// So we go up from dist/config to the backend root
let envPath = path_1.default.resolve(__dirname, '../../.env');
// Check if the .env file exists, if not try alternative paths
if (!fs_1.default.existsSync(envPath)) {
    console.warn(`⚠️ .env file not found at: ${envPath}`);
    // Try alternative paths
    const alternativePaths = [
        path_1.default.resolve(__dirname, '../.env'),
        path_1.default.resolve(process.cwd(), '.env'),
        path_1.default.resolve('.', '.env'),
    ];
    for (const altPath of alternativePaths) {
        if (fs_1.default.existsSync(altPath)) {
            envPath = altPath;
            console.log(`✅ Found .env at alternative path: ${envPath}`);
            break;
        }
    }
}
dotenv_1.default.config({ path: envPath });
console.log('🔧 Loading .env from:', envPath);
console.log('🔧 Current working directory:', process.cwd());
console.log('🔧 __dirname:', __dirname);
console.log('🔧 Raw PORT from env:', process.env.PORT);
// Environment variable schema with validation
const envSchema = zod_1.z.object({
    // Server
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000').transform((val) => {
        // Check if it's a named pipe (for IIS deployment)
        if (typeof val === 'string' && (val.includes('\\') || val.includes('pipe'))) {
            console.log(`🔌 Using named pipe: ${val}`);
            return val;
        }
        // Try to parse as number for regular ports
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0 || parsed >= 65536) {
            console.warn(`⚠️ Invalid PORT value: ${val}, using default port 3000`);
            return 3000;
        }
        return parsed;
    }),
    API_PREFIX: zod_1.z.string().default('/api/v1'),
    // Database Environment (determines which connection string to use)
    DB_ENVIRONMENT: zod_1.z.enum(['local', 'production']).default('local'),
    // JWT
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // CORS
    // Use '*' to allow all origins, or provide specific origins separated by commas
    // Example: 'http://localhost:5173,https://example.com' or '*'
    CORS_ORIGIN: zod_1.z.string().default('*'),
});
// Validate environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error('❌ Invalid environment variables:');
        if (error instanceof zod_1.z.ZodError) {
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        }
        process.exit(1);
    }
};
exports.env = parseEnv();
exports.default = exports.env;
//# sourceMappingURL=env.config.js.map