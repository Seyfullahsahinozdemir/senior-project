import { ValidationException } from '@application/exceptions';
import { makeResetPasswordCommand } from '../reset.password.command';
import { ResetPasswordCommandRequest } from '../reset.password.command';
import CustomResponse from '@application/interfaces/custom.response';

describe('Reset Password Command', () => {
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

  describe('makeResetPasswordCommand', () => {
    it('should call authService.resetPassword and return success response', async () => {
      const command: ResetPasswordCommandRequest = {
        _id: 'someUserId',
      };

      authServiceMock.resetPassword.mockResolvedValue(true);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const resetPasswordCommand = makeResetPasswordCommand(dependenciesMock);
      await resetPasswordCommand(command, resMock);

      expect(authServiceMock.resetPassword).toHaveBeenCalledWith('someUserId');
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: null,
          message: 'Check email for verification.',
          success: true,
        }),
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    it('should return error response if authService.resetPassword returns false', async () => {
      const command: ResetPasswordCommandRequest = {
        _id: 'someUserId',
      };

      authServiceMock.resetPassword.mockResolvedValue(false);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const resetPasswordCommand = makeResetPasswordCommand(dependenciesMock);
      await resetPasswordCommand(command, resMock);

      expect(authServiceMock.resetPassword).toHaveBeenCalledWith('someUserId');
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: false,
          message: 'An error occurred while reset password.',
          success: false,
        }),
      );
      expect(resMock.status).toHaveBeenCalledWith(400);
    });
    it('should handle validation errors', async () => {
      const command: ResetPasswordCommandRequest = {
        // invalid command, missing required fields
        _id: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const resetPasswordCommand = makeResetPasswordCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await resetPasswordCommand(command, resMock);
      } catch (error: any) {
        // Assert on the expected response for validation errors
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

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

      // Assert that authService.resetPassword was not called
      expect(authServiceMock.resetPassword).not.toHaveBeenCalled();
    });
  });
});
