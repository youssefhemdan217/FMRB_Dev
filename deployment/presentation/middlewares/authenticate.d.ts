import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../application/services/TokenService';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare const authenticate: (tokenService: TokenService) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authenticate.d.ts.map