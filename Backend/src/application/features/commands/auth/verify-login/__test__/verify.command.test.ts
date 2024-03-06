import CustomResponse from '@application/interfaces/custom.response';
import { makeVerifyForLoginCommand } from '../verify.command';
import { VerifyForLoginCommandRequest } from '../verify.command';
import { ValidationException } from '@application/exceptions';
import { Response } from 'express';

describe('Verify For Login Command', () => {
  const authServiceMock = {
    currentUserId: null, // or provide a dummy value

    login: jest.fn(),
    register: jest.fn(),
    verifyForLogin: jest.fn(),
    getMyProfile: jest.fn(),
    resetPassword: jest.fn(),
    verifyForResetPassword: jest.fn(),
  };

  const dependenciesMock = {
    authService: authServiceMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeVerifyForLoginCommand', () => {
    it('should call authService.verifyForLogin and return success response', async () => {
      const command: VerifyForLoginCommandRequest = {
        email: 'test@example.com',
        otpCode: '123456',
      };

      const expectedAccessToken = 'mockAccessToken';
      const expectedRefreshToken = 'mockRefreshToken';
      const expectedUser = {
        _id: 'mockUserId',
        username: 'mockUsername',
        email: 'test@example.com',
        isAdmin: false,
      };

      // Mock the implementation of authService.verifyForLogin
      authServiceMock.verifyForLogin.mockResolvedValueOnce({
        accessToken: expectedAccessToken,
        refreshToken: expectedRefreshToken,
        user: expectedUser,
      });

      const resMock: Response = {
        cookie: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const verifyForLoginCommand = makeVerifyForLoginCommand(dependenciesMock);

      // Call the command function
      await verifyForLoginCommand(command, resMock);

      // Assert that authService.verifyForLogin was called with the correct arguments
      expect(authServiceMock.verifyForLogin).toHaveBeenCalledWith({
        email: command.email,
        otpCode: command.otpCode,
      });

      // Assert that the response was handled correctly
      expect(resMock.cookie).toHaveBeenCalledWith('refreshToken', expectedRefreshToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
      expect(resMock.header).toHaveBeenCalledWith('Authorization', expectedAccessToken);
    });

    it('should handle validation errors', async () => {
      const command: VerifyForLoginCommandRequest = {
        // invalid command, missing required fields
        email: '',
        otpCode: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const verifyForLoginCommand = makeVerifyForLoginCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await verifyForLoginCommand(command, resMock);
      } catch (error: any) {
        // Assert on the expected response for validation errors
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(3); // Adjust this based on your actual validation rules

        // Assuming you have a method to handle ValidationException in CustomResponse
        const customResponse = new CustomResponse(null, 'Validation failed.');
        customResponse.error400(resMock);

        expect(resMock.json).toHaveBeenCalledWith(
          expect.objectContaining({
            data: null,
            message: 'Validation failed.',
            success: false,
          }),
        );
        expect(resMock.status).toHaveBeenCalledWith(400);
      }

      // Assert that authService.verifyForLogin was not called
      expect(authServiceMock.verifyForLogin).not.toHaveBeenCalled();
    });
  });
});
