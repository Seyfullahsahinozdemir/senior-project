import { User } from '@domain/entities';
import { UserService } from '../user.service';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { ObjectId } from 'mongodb';

// Mock IUserRepository for testing purposes
const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  findByUsernameAsync: jest.fn(),
  findByEmailAsync: jest.fn(),
  aggregate: jest.fn(),
};

const mockAuthService = {
  resetPassword: jest.fn(),
  verifyForResetPassword: jest.fn(),
  getMyProfile: jest.fn(),
  verifyForLogin: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  currentUserId: null,
};

const mockImageService = {
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  findFileIdByName: jest.fn(),
  getImage: jest.fn(),
  getImageName: jest.fn(),
  generatePublicUrl: jest.fn(),
};

const mockItemRepository = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  aggregate: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService({
      userRepository: mockUserRepository,
      authService: mockAuthService,
      imageService: mockImageService,
      itemRepository: mockItemRepository,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should return a list of users', async () => {
      // Mock data for the repository's find method
      const mockUsers = [
        new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123'),
        new User('Jane', 'Doe', 'jane.doe', 'jane@example.com', 'password456'),
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      // Mock request
      const mockRequest: PaginatedRequest = { pageIndex: '0', pageSize: '10' };

      const result = await userService.listUsers(mockRequest);

      expect(mockUserRepository.find).toHaveBeenCalledWith({}, 0, 10);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getFollowers', () => {
    it('should return a list of followers for a user', async () => {
      const userId = 'userId';
      const mockUser = new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123');
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Mock data for followers
      const mockFollowers = [
        new User('Follower 1', 'Doe', 'follower1', 'follower1@example.com', 'password789'),
        new User('Follower 2', 'Doe', 'follower2', 'follower2@example.com', 'password456'),
      ];

      mockUserRepository.find.mockResolvedValue(mockFollowers);

      const result = await userService.getFollowers();

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.find).toHaveBeenCalledWith({ _id: { $in: mockUser.followers } });
      expect(result).toEqual(mockFollowers);
    });

    it('should throw an error if the user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.getFollowers()).rejects.toThrowError('User not found');
    });
  });

  describe('getFollowing', () => {
    it('should return a list of users that the specified user is following', async () => {
      const userId = 'userId';
      const mockUser = new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123');
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Mock data for following users
      const mockFollowing = [
        new User('Following 1', 'Doe', 'following1', 'following1@example.com', 'password789'),
        new User('Following 2', 'Doe', 'following2', 'following2@example.com', 'password456'),
      ];

      mockUserRepository.find.mockResolvedValue(mockFollowing);

      const result = await userService.getFollowing();

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.find).toHaveBeenCalledWith({ _id: { $in: mockUser.following } }, 0, 0);
      expect(result).toEqual(mockFollowing);
    });

    it('should throw an error if the user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.getFollowing()).rejects.toThrowError('User not found');
    });
  });

  describe('follow', () => {
    it('should follow another user', async () => {
      const currentUserId = new ObjectId().toHexString();
      const targetUserId = new ObjectId().toHexString();

      // Mock valid user objects
      const mockCurrentUser = new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123');
      const mockTargetUser = new User('Target', 'User', 'target.user', 'target@example.com', 'password456');

      mockUserRepository.findOne.mockResolvedValueOnce(mockCurrentUser);
      mockUserRepository.findOne.mockResolvedValueOnce(mockTargetUser);

      const result = await userService.follow(currentUserId, targetUserId);

      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(1, currentUserId);
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(2, targetUserId);
      expect(mockUserRepository.update).toHaveBeenNthCalledWith(1, currentUserId, expect.any(Object));
      expect(mockUserRepository.update).toHaveBeenNthCalledWith(2, targetUserId, expect.any(Object));
      expect(result).toBe(true);
    });

    it('should throw an error if current user is the same as target user', async () => {
      const userId = new ObjectId().toHexString();

      await expect(userService.follow(userId, userId)).rejects.toThrowError(
        'Users ids same. You cannot follow yourself.',
      );
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if either current user or target user is not found', async () => {
      const currentUserId = new ObjectId().toHexString();
      const targetUserId = new ObjectId().toHexString();

      const mockCurrentUser = new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123');
      mockUserRepository.findOne.mockResolvedValueOnce(mockCurrentUser);
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(userService.follow(currentUserId, targetUserId)).rejects.toThrowError('User not found');
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(1, currentUserId);
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(2, targetUserId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if either current user or target user ID is invalid', async () => {
      const currentUserId = 'invalidUserId';
      const targetUserId = 'targetUserId';

      await expect(userService.follow(currentUserId, targetUserId)).rejects.toThrowError('Invalid user ID format');
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('unFollow', () => {
    it('should unfollow another user', async () => {
      const currentUserId = new ObjectId().toHexString();
      const targetUserId = new ObjectId().toHexString();

      // Mock valid user objects
      const mockCurrentUser = new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123');
      const mockTargetUser = new User('Target', 'User', 'target.user', 'target@example.com', 'password456');

      mockUserRepository.findOne.mockResolvedValueOnce(mockCurrentUser);
      mockUserRepository.findOne.mockResolvedValueOnce(mockTargetUser);

      const result = await userService.unFollow(currentUserId, targetUserId);

      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(1, currentUserId);
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(2, targetUserId);
      expect(mockUserRepository.update).toHaveBeenNthCalledWith(1, currentUserId, expect.any(Object));
      expect(mockUserRepository.update).toHaveBeenNthCalledWith(2, targetUserId, expect.any(Object));
      expect(result).toBe(true);
    });

    it('should throw an error if either current user or target user is not found', async () => {
      const currentUserId = new ObjectId().toHexString();
      const targetUserId = new ObjectId().toHexString();

      const mockCurrentUser = new User('John', 'Doe', 'john.doe', 'john@example.com', 'password123');
      mockUserRepository.findOne.mockResolvedValueOnce(mockCurrentUser);
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      await expect(userService.unFollow(currentUserId, targetUserId)).rejects.toThrowError('User not found');
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(1, currentUserId);
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(2, targetUserId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if either current user or target user ID is invalid', async () => {
      const currentUserId = 'invalidUserId';
      const targetUserId = 'targetUserId';

      await expect(userService.unFollow(currentUserId, targetUserId)).rejects.toThrowError('Invalid user ID format');
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });
});
