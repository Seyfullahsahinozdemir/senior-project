import { TokenPayload } from '@application/dto/auth/token.payload';
import { ITokenService } from '@application/interfaces/services/authentication/IToken';
import jsonwebtoken from 'jsonwebtoken';

export class TokenService implements ITokenService {
  secretKey = 'Senior';

  generateToken(payload: TokenPayload): string {
    return jsonwebtoken.sign(payload, this.secretKey, { expiresIn: '10d' });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jsonwebtoken.sign(payload, this.secretKey, { expiresIn: '1d' });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decodedToken = jsonwebtoken.verify(token, this.secretKey) as TokenPayload;
      return decodedToken;
    } catch (error) {
      return null;
    }
  }
}
