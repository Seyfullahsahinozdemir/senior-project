import { makeGetProfileCommand, GetProfileCommandRequest } from '../get.profile.command';
import { ValidationException } from '@application/exceptions';
import CustomResponse from '@application/interfaces/custom.response';

describe('GetProfile Command', () => {
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

  describe('makeGetProfileCommand', () => {
    it('should call validate and authService.getMyProfile, then return success response', async () => {
      const command: GetProfileCommandRequest = {
        _id: 'user123',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getProfileCommand = makeGetProfileCommand(dependenciesMock);

      authServiceMock.getMyProfile.mockResolvedValue({
        /* mocked user profile data */
      });

      await getProfileCommand(command, resMock);

      expect(authServiceMock.getMyProfile).toHaveBeenCalledWith(command._id);
      expect(resMock.json).toHaveBeenCalledWith({
        data: { user: expect.any(Object) }, // Adjust the expectation based on the actual response structure
        message: 'success',
        success: true,
      });
    });

    it('should handle validation errors', async () => {
      const command: GetProfileCommandRequest = {
        _id: '', // Invalid, as it's required
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getProfileCommand = makeGetProfileCommand(dependenciesMock);

      try {
        await getProfileCommand(command, resMock);
        // If there is no validation error, fail the test
      } catch (error: any) {
        // Expect a ValidationException to be thrown
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

        // Ensure that authService.getMyProfile is not called in case of validation error
        expect(authServiceMock.getMyProfile).not.toHaveBeenCalled();

        // Assuming you have a method to handle ValidationException in CustomResponse
        const customResponse = new CustomResponse(null, 'Validation failed.');
        customResponse.error400(resMock);

        // Ensure that the response is formatted correctly
        expect(resMock.json).toHaveBeenCalledWith(
          expect.objectContaining({
            data: null,
            message: 'Validation failed.',
            success: false,
          }),
        );

        // Ensure that the status code is set to 400
        expect(resMock.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
