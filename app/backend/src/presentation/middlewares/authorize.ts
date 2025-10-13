import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';
import { ForbiddenError } from '../../domain/errors/DomainErrors';
import { UserRole } from '../../domain/entities/User';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('User not authenticated'));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

