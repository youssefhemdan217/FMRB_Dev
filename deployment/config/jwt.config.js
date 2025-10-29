"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const env_config_1 = require("./env.config");
exports.jwtConfig = {
    access: {
        secret: env_config_1.env.JWT_ACCESS_SECRET,
        expiresIn: env_config_1.env.JWT_ACCESS_EXPIRES_IN,
    },
    refresh: {
        secret: env_config_1.env.JWT_REFRESH_SECRET,
        expiresIn: env_config_1.env.JWT_REFRESH_EXPIRES_IN,
    },
};
exports.default = exports.jwtConfig;
//# sourceMappingURL=jwt.config.js.map