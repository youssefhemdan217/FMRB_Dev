"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
const env_config_1 = require("./env.config");
// Parse CORS origin - supports '*' for all origins or comma-separated list
const parseCorsOrigin = (origin) => {
    if (origin === '*') {
        return '*';
    }
    // Split by comma and trim whitespace
    const origins = origin.split(',').map(o => o.trim()).filter(o => o.length > 0);
    return origins.length === 1 ? origins[0] : origins;
};
exports.serverConfig = {
    port: env_config_1.env.PORT, // Can be number or string (named pipe)
    apiPrefix: env_config_1.env.API_PREFIX,
    nodeEnv: env_config_1.env.NODE_ENV,
    corsOrigin: parseCorsOrigin(env_config_1.env.CORS_ORIGIN),
    isDevelopment: env_config_1.env.NODE_ENV === 'development',
    isProduction: env_config_1.env.NODE_ENV === 'production',
};
// Debug logging
console.log('🔧 Server Config:', {
    port: exports.serverConfig.port,
    portType: typeof exports.serverConfig.port,
    nodeEnv: exports.serverConfig.nodeEnv,
    apiPrefix: exports.serverConfig.apiPrefix,
});
exports.default = exports.serverConfig;
//# sourceMappingURL=server.config.js.map