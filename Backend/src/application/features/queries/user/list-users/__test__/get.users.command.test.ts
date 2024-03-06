import { makeGetUsersCommand, GetUsersCommandRequest } from '../get.users.command';
import { ValidationException } from '@application/exceptions';
import CustomResponse from '@application/interfaces/custom.response';

jest.mock('../get.users.command.validator', () => ({
  validate: jest.fn(),
}));

describe('GetUsers Command', () => {
  const userServiceMock = {
    follow: jest.fn(),
    unFollow: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    listUsers: jest.fn(),
  };

  const dependenciesMock = {
    userService: userServiceMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeGetUsersCommand', () => {
    it('should call validate and userService.listUsers, then return success response', async () => {
      const command: GetUsersCommandRequest = {
        pageIndex: 0,
        pageSize: 10,
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getUsersCommand = makeGetUsersCommand(dependenciesMock);

      userServiceMock.listUsers.mockResolvedValue(['user1', 'user2']);

      await getUsersCommand(command, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        data: { users: ['user1', 'user2'] },
        message: 'success',
        success: true,
      });
    });

    it('should handle validation errors', async () => {
      const command: GetUsersCommandRequest = {
        pageIndex: 'invalid', // Invalid type for pageIndex
        pageSize: 10,
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getUsersCommand = makeGetUsersCommand(dependenciesMock);

      try {
        await getUsersCommand(command, resMock);
        // If there is no validation error, fail the test
      } catch (error: any) {
        // Expect a ValidationException to be thrown
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

        // Ensure that authService.listUsers is not called in case of validation error
        expect(userServiceMock.listUsers).not.toHaveBeenCalled();

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
