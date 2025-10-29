"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../../domain/entities/User");
class AuthController {
    registerUserUseCase;
    loginUserUseCase;
    updateUserRoleUseCase;
    constructor(registerUserUseCase, loginUserUseCase, updateUserRoleUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.updateUserRoleUseCase = updateUserRoleUseCase;
    }
    register = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.registerUserUseCase.execute(data);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const data = req.body;
            const result = await this.loginUserUseCase.execute(data);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (_req, res, next) => {
        try {
            // For JWT-based auth, logout is primarily handled client-side
            // This endpoint confirms the logout action and could be extended to:
            // - Blacklist the token
            // - Invalidate refresh tokens in database
            // - Log the logout event
            res.json({
                message: 'Logged out successfully',
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateRole = async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            // Validate role
            if (!role || !Object.values(User_1.UserRole).includes(role)) {
                res.status(400).json({
                    error: 'Invalid role. Must be "user" or "admin"',
                });
                return;
            }
            const result = await this.updateUserRoleUseCase.execute({ userId, role });
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map