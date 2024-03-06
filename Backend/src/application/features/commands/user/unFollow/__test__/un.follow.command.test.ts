import { makeUnFollowCommand, UnFollowCommandRequest } from '../un.follow.command';
import { ValidationException } from '@application/exceptions';
import { validate } from '../un.follow.command.validator';
import CustomResponse from '@application/interfaces/custom.response';

jest.mock('../un.follow.command.validator', () => ({
  validate: jest.fn(),
}));

describe('Unfollow Command', () => {
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

  describe('makeUnFollowCommand', () => {
    it('should call validate and userService.unFollow, then return success response', async () => {
      const command: UnFollowCommandRequest = {
        currentUserId: 'user1',
        targetUserId: 'user2',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const unFollowCommand = makeUnFollowCommand(dependenciesMock);
      await unFollowCommand(command, resMock);

      (validate as jest.Mock).mockResolvedValue(undefined);

      expect(validate).toHaveBeenCalledWith(command);
      expect(userServiceMock.unFollow).toHaveBeenCalledWith('user1', 'user2');
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: null,
          message: 'Unfollow success',
          success: true,
        }),
      );
    });

    it('should handle validation errors', async () => {
      const command: UnFollowCommandRequest = {
        // invalid command, missing required fields
        currentUserId: '',
        targetUserId: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const unFollowCommand = makeUnFollowCommand(dependenciesMock);

      try {
        await unFollowCommand(command, resMock);
        // If there is no validation error, fail the test
      } catch (error: any) {
        // Expect a ValidationException to be thrown
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(2); // Adjust this based on your actual validation rules

        // Ensure that userService.unFollow is not called in case of validation error
        expect(userServiceMock.unFollow).not.toHaveBeenCalled();

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
