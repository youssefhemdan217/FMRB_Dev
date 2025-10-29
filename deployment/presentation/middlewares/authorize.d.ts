import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';
import { UserRole } from '../../domain/entities/User';
export declare const authorize: (...roles: UserRole[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map