"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const DomainErrors_1 = require("../../domain/errors/DomainErrors");
const config_1 = require("../../config");
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err instanceof DomainErrors_1.ValidationError) {
        return res.status(400).json({
            error: err.message,
            type: 'ValidationError',
        });
    }
    if (err instanceof DomainErrors_1.UnauthorizedError) {
        return res.status(401).json({
            error: err.message,
            type: 'UnauthorizedError',
        });
    }
    if (err instanceof DomainErrors_1.ForbiddenError) {
        return res.status(403).json({
            error: err.message,
            type: 'ForbiddenError',
        });
    }
    if (err instanceof DomainErrors_1.NotFoundError) {
        return res.status(404).json({
            error: err.message,
            type: 'NotFoundError',
        });
    }
    if (err instanceof DomainErrors_1.ConflictError) {
        return res.status(409).json({
            error: err.message,
            type: 'ConflictError',
        });
    }
    // Generic server error
    return res.status(500).json({
        error: config_1.serverConfig.isDevelopment ? err.message : 'Internal server error',
        type: 'ServerError',
        ...(config_1.serverConfig.isDevelopment && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map