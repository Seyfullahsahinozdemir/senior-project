// Import necessary modules and dependencies
import { Response } from 'express';
import { IAuthService } from '@application/interfaces';
import { makeGetProfileCommand } from '../get.profile.command';
import { NotFoundException } from '@application/exceptions';
import { IUserRepository } from '@application/persistence';

// Mock dependencies
const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123',
  getMyProfile: jest.fn(),
};
const userRepositoryMock: Partial<IUserRepository> = {
  findOne: jest.fn(),
};

const dependenciesMock = {
  authService: authServiceMock as IAuthService,
  userRepository: userRepositoryMock as IUserRepository,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('getProfileCommand', () => {
  const getProfileCommand = makeGetProfileCommand(dependenciesMock);

  it('should return user profile successfully', async () => {
    // Mock data
    const mockUserProfile = {
      _id: 'user123',
      createdAt: new Date(),
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      preferences: {},
      following: ['user456'],
      followers: ['user789'],
    };

    const mockFollowingUser = {
      _id: 'user456',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
      email: 'janesmith@example.com',
    };

    const mockFollowerUser = {
      _id: 'user789',
      firstName: 'Bob',
      lastName: 'Brown',
      username: 'bobbrown',
      email: 'bobbrown@example.com',
    };

    // Setup mock implementations
    (authServiceMock.getMyProfile as jest.Mock).mockResolvedValue(mockUserProfile);
    (userRepositoryMock.findOne as jest.Mock)
      .mockResolvedValueOnce(mockFollowingUser)
      .mockResolvedValueOnce(mockFollowerUser);

    // Execute command
    await getProfileCommand(resMock as Response);

    // Assertions
    expect(authServiceMock.getMyProfile).toHaveBeenCalledWith(authServiceMock.currentUserId);
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(2);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user456');
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user789');

    const expectedResponse = {
      user: {
        _id: 'user123',
        createdAt: mockUserProfile.createdAt,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        preferences: {},
        following: [mockFollowingUser],
        followers: [mockFollowerUser],
      },
    };

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'success',
      success: true,
    });
  });

  it('should throw NotFoundException if current user is not found', async () => {
    // Setup mock implementation
    authServiceMock.currentUserId = null;

    // Execute command and catch error
    await expect(getProfileCommand(resMock as Response)).rejects.toThrow(NotFoundException);

    // Assertions
    expect(authServiceMock.getMyProfile).not.toHaveBeenCalled();
    expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if user profile is not found', async () => {
    // Setup mock implementations
    authServiceMock.currentUserId = 'user123';
    (authServiceMock.getMyProfile as jest.Mock).mockRejectedValue(new NotFoundException('User not found.'));

    // Execute command and catch error
    await expect(getProfileCommand(resMock as Response)).rejects.toThrow(NotFoundException);

    // Assertions
    expect(authServiceMock.getMyProfile).toHaveBeenCalledWith('user123');
    expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
  });
});
