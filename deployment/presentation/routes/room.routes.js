"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomRoutes = void 0;
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const User_1 = require("../../domain/entities/User");
const createRoomRoutes = (roomController, tokenService) => {
    const router = (0, express_1.Router)();
    // Public routes
    router.get('/', roomController.getAll);
    router.get('/:id', roomController.getById);
    // Protected routes (require authentication)
    router.post('/', (0, authenticate_1.authenticate)(tokenService), roomController.create);
    router.put('/:id', (0, authenticate_1.authenticate)(tokenService), roomController.update);
    router.delete('/:id', (0, authenticate_1.authenticate)(tokenService), (0, authorize_1.authorize)(User_1.UserRole.ADMIN), roomController.delete);
    return router;
};
exports.createRoomRoutes = createRoomRoutes;
//# sourceMappingURL=room.routes.js.map