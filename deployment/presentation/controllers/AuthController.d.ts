import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUser';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUser';
import { UpdateUserRoleUseCase } from '../../application/use-cases/auth/UpdateUserRole';
export declare class AuthController {
    private registerUserUseCase;
    private loginUserUseCase;
    private updateUserRoleUseCase;
    constructor(registerUserUseCase: RegisterUserUseCase, loginUserUseCase: LoginUserUseCase, updateUserRoleUseCase: UpdateUserRoleUseCase);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logout: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map