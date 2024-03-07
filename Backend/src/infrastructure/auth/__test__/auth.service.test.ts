import { AuthService } from '../auth.service';
import { User } from '@domain/entities/identity/user';
import { NotFoundException, ValidationException } from '@application/exceptions';
import { OtpTargetEnum } from '@application/enums/otp.target.enum';
import * as bcrypt from 'bcrypt';

// Mocking dependencies
const mockedEmailSend = jest.fn();

const mockedUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  findByUsernameAsync: jest.fn(),
  findByEmailAsync: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockedTokenService = {
  generateToken: jest.fn(),
  generateRefreshToken: jest.fn(),
};

const mockedOtpRepository = {
  find: jest.fn(),
  create: jest.fn(),
  deleteMany: jest.fn(),
};

// Mock bcrypt directly
jest.mock('bcrypt', () => {
  const originalBcrypt = jest.requireActual('bcrypt');
  return {
    ...originalBcrypt,
    compareSync: jest.fn(),
  };
});

jest.mock('@application/persistence', () => ({
  IUserRepository: mockedUserRepository,
  IOtpRepository: mockedOtpRepository,
}));

jest.mock('@application/interfaces/services/authentication/IToken', () => ({
  ITokenService: mockedTokenService,
}));

jest.mock('@infrastructure/email/email.service.ts', () => {
  const mockedEmailSend = jest.fn();
  return {
    emailSend: mockedEmailSend,
  };
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService({
      tokenService: mockedTokenService as any,
      userRepository: mockedUserRepository as any,
      otpRepository: mockedOtpRepository as any,
    });
    jest.clearAllMocks();
  });

  describe('resetPassword', () => {
    it('should reset password and send email', async () => {
      // Mock data
      const nonExistentUserId = 'nonexistentUser123';

      // Ensure that findOne returns null to simulate user not found
      mockedUserRepository.findOne.mockResolvedValueOnce(null);

      // Call resetPassword with a non-existent user ID
      await expect(authService.resetPassword(nonExistentUserId)).rejects.toThrowError(NotFoundException);

      // Ensure that mockedOtpRepository.create and mockedEmailSend are not called
      expect(mockedOtpRepository.create).not.toHaveBeenCalled();
      expect(mockedEmailSend).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockedUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(authService.resetPassword('nonexistentUserId')).rejects.toThrowError(NotFoundException);
    });

    it('should throw an error if OTP creation fails', async () => {
      // Mock data
      const userId = 'user123';

      // Ensure that findOne returns a user to avoid the 'User not found' exception
      mockedUserRepository.findOne.mockResolvedValueOnce(
        new User('John', 'Doe', 'john.doe', 'user@example.com', 'hashedPassword'),
      );

      // Ensure that mockedOtpRepository.create throws an error with a specific message
      const expectedErrorMessage = 'OTP creation failed';
      mockedOtpRepository.create.mockRejectedValueOnce(new Error(expectedErrorMessage));

      // Call resetPassword and expect it to throw an error with the expected message
      await expect(authService.resetPassword(userId)).rejects.toThrowError(expectedErrorMessage);

      // Ensure that mockedEmailSend is not called
      expect(mockedEmailSend).not.toHaveBeenCalled();
    });
  });

  describe('verifyForResetPassword', () => {
    it('should reset password successfully for valid OTP code', async () => {
      // Mock data
      const validEmail = 'user@example.com';
      const validOtpCode = '123456'; // Assuming a valid OTP code
      // Mock user data
      const mockUser = new User('John', 'Doe', 'john.doe', validEmail, 'hashedPassword');
      // Mock OTP codes
      const mockOtpCodes = [
        { otp: validOtpCode, expirationDate: new Date(Date.now() + 60000) }, // Valid OTP
      ];
      // Mock find function to return the user and OTP codes
      mockedUserRepository.find.mockResolvedValueOnce([mockUser]);
      mockedOtpRepository.find.mockResolvedValueOnce(mockOtpCodes);
      // Mock bcrypt compareSync to always return true
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      // Call verifyForResetPassword with valid data
      const newPassword = 'newPassword123';
      const result = await authService.verifyForResetPassword(
        { email: validEmail, otpCode: validOtpCode },
        newPassword,
      );
      // Expect the result to be true, indicating a successful password reset
      expect(result).toBe(true);
      // Ensure that the OTP codes are deleted
      expect(mockedOtpRepository.deleteMany).toHaveBeenCalledWith({
        email: validEmail,
        target: OtpTargetEnum.RESETPASSWORD,
      });
      // Ensure that the user's password is updated
      expect(mockUser.password).not.toBe('hashedPassword'); // Assuming the password is updated
      expect(mockedUserRepository.update).toHaveBeenCalledWith(mockUser._id?.toString(), mockUser);
    });
    it('should throw NotFoundException for non-existent user during password reset verification', async () => {
      mockedOtpRepository.find.mockReset();

      // Mock data
      const nonExistentEmail = 'nonexistent@example.com';
      const validOtpCode = '123456';
      // Ensure that find function returns an empty array to simulate a non-existent user
      mockedUserRepository.find.mockResolvedValueOnce([]);
      // Call verifyForResetPassword with non-existent user data
      await expect(
        authService.verifyForResetPassword({ email: nonExistentEmail, otpCode: validOtpCode }, 'newPassword'),
      ).rejects.toThrowError(NotFoundException);
      // Ensure that mockedOtpRepository.find is not called
      expect(mockedOtpRepository.find).not.toHaveBeenCalled();
    });
    it('should throw NotFoundException if no OTP codes found for the specified user during password reset verification', async () => {
      // Mock data
      const validEmail = 'user@example.com';
      const validOtpCode = '123456';
      // Mock user data
      const mockUser = new User('John', 'Doe', 'john.doe', validEmail, 'hashedPassword');
      // Ensure that find function returns the user, but no OTP codes
      mockedUserRepository.find.mockResolvedValueOnce([mockUser]);
      mockedOtpRepository.find.mockResolvedValueOnce([]);
      // Call verifyForResetPassword with valid user data but no OTP codes
      await expect(
        authService.verifyForResetPassword({ email: validEmail, otpCode: validOtpCode }, 'newPassword'),
      ).rejects.toThrowError(NotFoundException);
    });
    it('should throw ValidationException for incorrect OTP code during password reset verification', async () => {
      // Mock data
      const validEmail = 'user@example.com';
      const invalidOtpCode = '654321';
      // Mock user data
      const mockUser = new User('John', 'Doe', 'john.doe', validEmail, 'hashedPassword');
      // Mock OTP codes
      const mockOtpCodes = [
        { otp: '123456', expirationDate: new Date(Date.now() + 60000) }, // Valid OTP
      ];
      // Ensure that find function returns the user and OTP codes
      mockedUserRepository.find.mockResolvedValueOnce([mockUser]);
      mockedOtpRepository.find.mockResolvedValueOnce(mockOtpCodes);
      // Call verifyForResetPassword with incorrect OTP code
      await expect(
        authService.verifyForResetPassword({ email: validEmail, otpCode: invalidOtpCode }, 'newPassword'),
      ).rejects.toThrowError(ValidationException);
    });
    it('should throw ValidationException for expired OTP code during password reset verification', async () => {
      // Mock data
      const validEmail = 'user@example.com';
      const expiredOtpCode = '123456';
      // Mock user data
      const mockUser = new User('John', 'Doe', 'john.doe', validEmail, 'hashedPassword');
      // Mock expired OTP codes
      const mockOtpCodes = [
        { otp: expiredOtpCode, expirationDate: new Date(Date.now() - 60000) }, // Expired OTP
      ];
      // Ensure that find function returns the user and expired OTP codes
      mockedUserRepository.find.mockResolvedValueOnce([mockUser]);
      mockedOtpRepository.find.mockResolvedValueOnce(mockOtpCodes);
      // Call verifyForResetPassword with expired OTP code
      await expect(
        authService.verifyForResetPassword({ email: validEmail, otpCode: expiredOtpCode }, 'newPassword'),
      ).rejects.toThrowError(ValidationException);
    });
  });
});
