"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.ConflictError = exports.ValidationError = exports.NotFoundError = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainError = DomainError;
class NotFoundError extends DomainError {
    constructor(resource, id) {
        super(id ? `${resource} with id ${id} not found` : `${resource} not found`);
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends DomainError {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends DomainError {
    constructor(message) {
        super(message);
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends DomainError {
    constructor(message = 'Unauthorized') {
        super(message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends DomainError {
    constructor(message = 'Forbidden') {
        super(message);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=DomainErrors.js.map