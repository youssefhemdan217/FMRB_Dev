import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUser';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUser';
import { RegisterDTO, LoginDTO } from '../../application/dtos/AuthDTO';

export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase
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
}

