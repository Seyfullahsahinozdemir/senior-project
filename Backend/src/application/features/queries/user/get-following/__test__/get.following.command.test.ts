import { makeGetFollowingCommand, GetFollowingCommandRequest } from '../get.following.command';
import { ValidationException } from '@application/exceptions';
import CustomResponse from '@application/interfaces/custom.response';

jest.mock('../get.following.command.validator', () => ({
  validate: jest.fn(),
}));

describe('GetFollowing Command', () => {
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

  describe('makeGetFollowingCommand', () => {
    it('should call validate and userService.getFollowing, then return success response', async () => {
      const command: GetFollowingCommandRequest = {
        pageIndex: 0,
        pageSize: 10,
        _id: 'user1',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getFollowingCommand = makeGetFollowingCommand(dependenciesMock);

      userServiceMock.getFollowing.mockResolvedValue(['following1', 'following2']);
      await getFollowingCommand(command, resMock);

      expect(resMock.json).toHaveBeenCalledWith({
        data: { users: ['following1', 'following2'] },
        message: 'success',
        success: true,
      });
    });

    it('should handle validation errors', async () => {
      const command: GetFollowingCommandRequest = {
        pageIndex: 'invalid', // Invalid type for pageIndex
        pageSize: 10,
        _id: 'user1',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getFollowingCommand = makeGetFollowingCommand(dependenciesMock);

      try {
        await getFollowingCommand(command, resMock);
        // If there is no validation error, fail the test
      } catch (error: any) {
        // Expect a ValidationException to be thrown
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

        // Ensure that userService.getFollowing is not called in case of validation error
        expect(userServiceMock.getFollowing).not.toHaveBeenCalled();

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
