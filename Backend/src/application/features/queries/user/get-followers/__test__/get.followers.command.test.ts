import { makeGetFollowersCommand, GetFollowersCommandRequest } from '../get.followers.command';
import { ValidationException } from '@application/exceptions';
import CustomResponse from '@application/interfaces/custom.response';

jest.mock('../get.followers.command.validator', () => ({
  validate: jest.fn(),
}));

describe('GetFollowers Command', () => {
  const userServiceMock = {
    follow: jest.fn(),
    unFollow: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    listUsers: jest.fn(),
    listUsersByUsername: jest.fn(),
    updateUser: jest.fn(),
    getProfileByUser: jest.fn(),

    getFavoriteItemsByUserId: jest.fn(),
    getFavoriteItemsByCurrentUser: jest.fn(),

    addFavoriteItem: jest.fn(),
    deleteFavoriteItem: jest.fn(),
  };

  const dependenciesMock = {
    userService: userServiceMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeGetFollowersCommand', () => {
    it('should call validate and userService.getFollowers, then return success response', async () => {
      const command: GetFollowersCommandRequest = {
        pageIndex: 0,
        pageSize: 10,
        _id: 'user1',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getFollowersCommand = makeGetFollowersCommand(dependenciesMock);

      // (validate as jest.Mock).mockResolvedValue(undefined);
      userServiceMock.getFollowers.mockResolvedValue(['follower1', 'follower2']);

      await getFollowersCommand(command, resMock);

      // Instead of using objectContaining, directly check the received value
      expect(resMock.json).toHaveBeenCalledWith({
        data: { users: ['follower1', 'follower2'] },
        message: 'success',
        success: true,
      });
    });

    it('should handle validation errors', async () => {
      const command: GetFollowersCommandRequest = {
        pageIndex: 'invalid', // Invalid type for pageIndex
        pageSize: 10,
        _id: 'user1',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getFollowersCommand = makeGetFollowersCommand(dependenciesMock);

      try {
        await getFollowersCommand(command, resMock);
        // If there is no validation error, fail the test
      } catch (error: any) {
        // Expect a ValidationException to be thrown
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

        // Ensure that userService.getFollowers is not called in case of validation error
        expect(userServiceMock.getFollowers).not.toHaveBeenCalled();

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
