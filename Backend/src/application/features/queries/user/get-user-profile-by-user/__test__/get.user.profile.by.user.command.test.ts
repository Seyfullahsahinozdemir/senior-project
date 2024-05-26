import { makeGetUserProfileByUserCommand, GetUserProfileByUser } from '../get.user.profile.by.user.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IUserService, IAuthService } from '@application/interfaces';
import { User } from '@domain/entities';
import { ObjectId } from 'mongodb';
import { validate } from '../get.user.profile.by.user.command.validator';
import { IUserRepository } from '@application/persistence';

// Mock dependencies
const userServiceMock: Partial<IUserService> = {
  getProfileByUser: jest.fn(),
};
const userRepositoryMock: Partial<IUserRepository> = {
  findOne: jest.fn(),
};
const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123', // Mock current user ID
};

const dependenciesMock: Pick<Dependencies, 'userRepository' | 'userService' | 'authService'> = {
  userService: userServiceMock as IUserService,
  userRepository: userRepositoryMock as IUserRepository,
  authService: authServiceMock as IAuthService,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock the validate function
jest.mock('../get.user.profile.by.user.command.validator.ts', () => ({
  validate: jest.fn(),
}));

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('getUserProfileByUserCommand', () => {
  const getUserProfileByUserCommand = makeGetUserProfileByUserCommand(dependenciesMock);

  it('should return user profile successfully', async () => {
    // Mock command parameters

    // Mock user profile
    const mockUserProfile: User = new User('First', 'Last', 'username123', 'user@example.com', 'password123');
    mockUserProfile._id = new ObjectId();
    mockUserProfile.following = [new ObjectId()];
    mockUserProfile.followers = [new ObjectId()];
    mockUserProfile.createdAt = new Date();
    mockUserProfile.preferences = { image: {} };

    const command: GetUserProfileByUser = { _id: mockUserProfile._id.toString() };

    // Setup mock implementations
    (userServiceMock.getProfileByUser as jest.Mock).mockResolvedValue(mockUserProfile);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUserProfile);

    // Execute command
    await getUserProfileByUserCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(userServiceMock.getProfileByUser).toHaveBeenCalledWith(command._id);

    // Ensure userRepositoryMock.findOne is called only once
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(2);

    const expectedResponse = {
      user: {
        _id: mockUserProfile._id,
        createdAt: mockUserProfile.createdAt,
        firstName: mockUserProfile.firstName,
        lastName: mockUserProfile.lastName,
        username: mockUserProfile.username,
        email: mockUserProfile.email,
        preferences: mockUserProfile.preferences,
        following: [
          {
            _id: mockUserProfile._id,
            firstName: 'First',
            lastName: 'Last',
            username: 'username123',
            email: 'user@example.com',
          },
        ],
        followers: [
          {
            _id: mockUserProfile._id,
            firstName: 'First',
            lastName: 'Last',
            username: 'username123',
            email: 'user@example.com',
          },
        ],
        isFollow: false,
      },
    };

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'success',
      success: true,
    });
  });
});
