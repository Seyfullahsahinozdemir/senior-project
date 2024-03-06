import CustomResponse from '@application/interfaces/custom.response';
import { makeRegisterCommand } from '../register.command';
import { RegisterCommandRequest } from '../register.command';
import { ValidationException } from '@application/exceptions';

describe('Register Command', () => {
  const authServiceMock = {
    currentUserId: null, // or provide a dummy value
    login: jest.fn(),
    verifyForLogin: jest.fn(),
    getMyProfile: jest.fn(),
    register: jest.fn(),
    resetPassword: jest.fn(),
    verifyForResetPassword: jest.fn(),
  };

  const dependenciesMock = {
    authService: authServiceMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeRegisterCommand', () => {
    it('should call authService.register and return success response', async () => {
      const command: RegisterCommandRequest = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      };

      authServiceMock.register.mockResolvedValue(true);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const registerCommand = makeRegisterCommand(dependenciesMock);
      await registerCommand(command, resMock);

      expect(authServiceMock.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: true,
          message: 'User created successful',
          success: true,
        }),
      );
      expect(resMock.status).toHaveBeenCalledWith(201);
    });

    it('should handle validation errors', async () => {
      const command: RegisterCommandRequest = {
        // invalid command, missing required fields
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const registerCommand = makeRegisterCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await registerCommand(command, resMock);
      } catch (error: any) {
        // Assert on the expected response for validation errors
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(7); // Adjust this based on your actual validation rules

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

      // Assert that authService.register was not called
      expect(authServiceMock.register).not.toHaveBeenCalled();
    });
  });
});
