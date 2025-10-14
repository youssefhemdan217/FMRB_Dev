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
    // Token without expiration for simplified authentication
    return jwt.sign(
      payload,
      jwtConfig.access.secret
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    // Token without expiration for simplified authentication
    return jwt.sign(
      payload,
      jwtConfig.refresh.secret
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.access.secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.refresh.secret) as TokenPayload;
  }
}

