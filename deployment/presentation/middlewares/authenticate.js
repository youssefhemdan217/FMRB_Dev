"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const DomainErrors_1 = require("../../domain/errors/DomainErrors");
const authenticate = (tokenService) => {
    return (req, _res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new DomainErrors_1.UnauthorizedError('No token provided');
            }
            const token = authHeader.substring(7);
            const payload = tokenService.verifyAccessToken(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };
            next();
        }
        catch (error) {
            next(new DomainErrors_1.UnauthorizedError('Invalid or expired token'));
        }
    };
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map