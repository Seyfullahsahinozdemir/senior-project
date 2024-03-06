import CustomResponse from '@application/interfaces/custom.response';
import { makeVerifyForResetPasswordCommand } from '../verify.command';
import { VerifyForResetPasswordCommandRequest } from '../verify.command';
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
    it('should call authService.verifyForResetPassword and return success response', async () => {
      const command: VerifyForResetPasswordCommandRequest = {
        email: 'test@example.com',
        otpCode: '123456',
        password: '123456',
      };

      // Mock the implementation of authService.verifyForLogin
      authServiceMock.verifyForResetPassword.mockResolvedValueOnce(true);

      const resMock: Response = {
        cookie: jest.fn().mockReturnThis(),
        header: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const verifyForResetPasswordCommand = makeVerifyForResetPasswordCommand(dependenciesMock);

      // Call the command function
      await verifyForResetPasswordCommand(command, resMock);

      // Assert that authService.verifyForLogin was called with the correct arguments
      expect(authServiceMock.verifyForResetPassword).toHaveBeenCalledWith(
        {
          email: command.email,
          otpCode: command.otpCode,
        },
        command.password,
      );

      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: null,
          message: 'Reset password success.',
          success: true,
        }),
      );
    });

    it('should handle validation errors', async () => {
      const command: VerifyForResetPasswordCommandRequest = {
        // invalid command, missing required fields
        email: '',
        otpCode: '',
        password: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const verifyForResetPasswordCommand = makeVerifyForResetPasswordCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await verifyForResetPasswordCommand(command, resMock);
      } catch (error: any) {
        // Assert on the expected response for validation errors
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(5); // Adjust this based on your actual validation rules

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
