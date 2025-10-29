"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class HashService {
    saltRounds = 10;
    async hash(password) {
        return bcrypt_1.default.hash(password, this.saltRounds);
    }
    async compare(password, hashedPassword) {
        return bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.HashService = HashService;
//# sourceMappingURL=HashService.js.map