"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = void 0;
const express_1 = require("express");
const validate_1 = require("../middlewares/validate");
const authValidators_1 = require("../validators/authValidators");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const User_1 = require("../../domain/entities/User");
const createAuthRoutes = (authController, tokenService) => {
    const router = (0, express_1.Router)();
    router.post('/register', (0, validate_1.validate)(authValidators_1.registerSchema), authController.register);
    router.post('/login', (0, validate_1.validate)(authValidators_1.loginSchema), authController.login);
    router.post('/logout', (0, authenticate_1.authenticate)(tokenService), authController.logout);
    router.put('/users/:userId/role', (0, authenticate_1.authenticate)(tokenService), (0, authorize_1.authorize)(User_1.UserRole.ADMIN), authController.updateRole);
    return router;
};
exports.createAuthRoutes = createAuthRoutes;
//# sourceMappingURL=auth.routes.js.map