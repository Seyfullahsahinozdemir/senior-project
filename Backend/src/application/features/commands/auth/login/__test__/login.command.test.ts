import { ValidationException } from '@application/exceptions';
import { makeLoginCommand } from '../login.command';
import { LoginCommandRequest } from '../login.command';
import CustomResponse from '@application/interfaces/custom.response';

describe('Login Command', () => {
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

  describe('makeLoginCommand', () => {
    it('should call authService.login and return success response', async () => {
      const command: LoginCommandRequest = {
        usernameOrEmail: 'testuser',
        password: 'testpassword',
      };

      authServiceMock.login.mockResolvedValue(true);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const loginCommand = makeLoginCommand(dependenciesMock);
      await loginCommand(command, resMock);

      expect(authServiceMock.login).toHaveBeenCalledWith({
        usernameOrEmail: 'testuser',
        password: 'testpassword',
      });
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: null,
          message: 'Check email for verification.',
          success: true,
        }),
      );
    });

    it('should return error response if authService.login returns false', async () => {
      const command: LoginCommandRequest = {
        usernameOrEmail: 'testuser',
        password: 'testpassword',
      };

      authServiceMock.login.mockResolvedValue(false);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const loginCommand = makeLoginCommand(dependenciesMock);
      await loginCommand(command, resMock);

      expect(authServiceMock.login).toHaveBeenCalledWith({
        usernameOrEmail: 'testuser',
        password: 'testpassword',
      });
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: false,
          message: 'Login unsuccessful',
          success: false,
        }),
      );
      expect(resMock.status).toHaveBeenCalledWith(400);
    });
    it('should handle validation errors', async () => {
      const command: LoginCommandRequest = {
        // invalid command, missing required fields
        usernameOrEmail: '',
        password: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const loginCommand = makeLoginCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await loginCommand(command, resMock);
      } catch (error: any) {
        // Assert on the expected response for validation errors
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(4); // Adjust this based on your actual validation rules

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

      // Assert that authService.login was not called
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });
  });
});
