import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUser';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUser';
import { UpdateUserRoleUseCase } from '../../application/use-cases/auth/UpdateUserRole';
import { RegisterDTO, LoginDTO } from '../../application/dtos/AuthDTO';
import { UserRole } from '../../domain/entities/User';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private updateUserRoleUseCase: UpdateUserRoleUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: RegisterDTO = req.body;
      const result = await this.registerUserUseCase.execute(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.loginUserUseCase.execute(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      // Validate role
      if (!role || !Object.values(UserRole).includes(role)) {
        res.status(400).json({
          error: 'Invalid role. Must be "user" or "admin"',
        });
        return;
      }

      const result = await this.updateUserRoleUseCase.execute({ userId, role });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

