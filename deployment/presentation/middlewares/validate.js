"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const DomainErrors_1 = require("../../domain/errors/DomainErrors");
const validate = (schema) => {
    return (req, _res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            const message = error.errors?.map((e) => e.message).join(', ') || 'Validation error';
            next(new DomainErrors_1.ValidationError(message));
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map