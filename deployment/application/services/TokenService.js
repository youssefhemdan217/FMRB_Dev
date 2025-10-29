"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
class TokenService {
    generateAccessToken(payload) {
        // Token without expiration for simplified authentication
        return jsonwebtoken_1.default.sign(payload, config_1.jwtConfig.access.secret);
    }
    generateRefreshToken(payload) {
        // Token without expiration for simplified authentication
        return jsonwebtoken_1.default.sign(payload, config_1.jwtConfig.refresh.secret);
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.jwtConfig.access.secret);
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, config_1.jwtConfig.refresh.secret);
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=TokenService.js.map