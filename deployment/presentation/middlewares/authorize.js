"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const DomainErrors_1 = require("../../domain/errors/DomainErrors");
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new DomainErrors_1.ForbiddenError('User not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new DomainErrors_1.ForbiddenError('Insufficient permissions'));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map