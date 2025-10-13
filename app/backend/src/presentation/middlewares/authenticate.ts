import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../application/services/TokenService';
import { UnauthorizedError } from '../../domain/errors/DomainErrors';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (tokenService: TokenService) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
      }

      const token = authHeader.substring(7);
      const payload = tokenService.verifyAccessToken(token);

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  };
};

