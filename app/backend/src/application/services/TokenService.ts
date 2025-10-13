import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config';
import { UserRole } from '../../domain/entities/User';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export class TokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      jwtConfig.access.secret,
      { expiresIn: jwtConfig.access.expiresIn } as jwt.SignOptions
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      jwtConfig.refresh.secret,
      { expiresIn: jwtConfig.refresh.expiresIn } as jwt.SignOptions
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.access.secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.refresh.secret) as TokenPayload;
  }
}

