import { TokenPayload } from '@application/dto/auth/token.payload';

export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
  generateRefreshToken(payload: TokenPayload): string;
}
