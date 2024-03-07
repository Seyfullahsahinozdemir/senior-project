import { TokenService } from '../token.service'; // Replace with the correct path to your token service file
import { TokenPayload } from '@application/dto/auth/token.payload';
import * as jsonwebtoken from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
  };
});

const mockedJsonWebToken = jsonwebtoken as jest.Mocked<typeof jsonwebtoken>;

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const payload: TokenPayload = {
        username: 'testuser',
        isAdmin: false,
        _id: 'userId123',
        email: 'testuser@example.com',
      };

      const mockGeneratedToken: any = 'mockGeneratedToken';
      mockedJsonWebToken.sign.mockReturnValueOnce(mockGeneratedToken);

      const result = tokenService.generateToken(payload);

      expect(mockedJsonWebToken.sign).toHaveBeenCalledWith(payload, 'Senior', { expiresIn: '1h' });
      expect(result).toBe(mockGeneratedToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const payload: TokenPayload = {
        username: 'testuser',
        isAdmin: false,
        _id: 'userId123',
        email: 'testuser@example.com',
      };

      const mockGeneratedToken: any = 'mockGeneratedToken';
      mockedJsonWebToken.sign.mockReturnValueOnce(mockGeneratedToken);

      const result = tokenService.generateRefreshToken(payload);

      expect(mockedJsonWebToken.sign).toHaveBeenCalledWith(payload, 'Senior', { expiresIn: '1d' });
      expect(result).toBe(mockGeneratedToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return the decoded payload', () => {
      const mockToken = 'mockToken';
      const mockDecodedPayload: any = {
        username: 'testuser',
        isAdmin: false,
        _id: 'userId123',
        email: 'testuser@example.com',
      };

      mockedJsonWebToken.verify.mockReturnValueOnce(mockDecodedPayload);

      const result = tokenService.verifyToken(mockToken);

      expect(mockedJsonWebToken.verify).toHaveBeenCalledWith(mockToken, 'Senior');
      expect(result).toEqual(mockDecodedPayload);
    });

    it('should return null for an invalid token', () => {
      const mockToken = 'invalidToken';

      mockedJsonWebToken.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const result = tokenService.verifyToken(mockToken);

      expect(mockedJsonWebToken.verify).toHaveBeenCalledWith(mockToken, 'Senior');
      expect(result).toBeNull();
    });
  });
});
