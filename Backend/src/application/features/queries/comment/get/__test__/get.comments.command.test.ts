import { Response } from 'express';
import { makeGetCommentsCommand, GetCommentsCommandRequest } from '../get.comments.command';
import { NotFoundException } from '@application/exceptions';
import { IPostService, IAuthService } from '@application/interfaces';
import { IUserRepository } from '@application/persistence';

// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  getComments: jest.fn(),
};
const userRepositoryMock: Partial<IUserRepository> = {
  findOne: jest.fn(),
};
const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123',
};

const dependenciesMock = {
  postService: postServiceMock as IPostService,
  userRepository: userRepositoryMock as IUserRepository,
  authService: authServiceMock as IAuthService,
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

describe('getCommentsCommand', () => {
  const getCommentsCommand = makeGetCommentsCommand(dependenciesMock);

  it('should return comments successfully', async () => {
    const command: GetCommentsCommandRequest = {
      pageIndex: '0',
      pageSize: '10',
      postId: 'post123',
    };

    const mockComments = [
      {
        _id: 'comment1',
        content: 'This is a comment',
        createdAt: new Date(),
        createdBy: 'user456',
        likes: ['user123', 'user789'],
      },
      {
        _id: 'comment2',
        content: 'This is another comment',
        createdAt: new Date(),
        createdBy: 'user789',
        likes: [],
      },
    ];

    const mockUser1 = {
      _id: 'user456',
      firstName: 'Jane',
      lastName: 'Doe',
      preferences: { image: 'image1.png' },
    };

    const mockUser2 = {
      _id: 'user789',
      firstName: 'John',
      lastName: 'Smith',
      preferences: { image: 'image2.png' },
    };

    // Setup mock implementations
    (postServiceMock.getComments as jest.Mock).mockResolvedValue(mockComments);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValueOnce(mockUser1).mockResolvedValueOnce(mockUser2);

    // Execute command
    await getCommentsCommand(command, resMock as Response);

    // Assertions
    expect(postServiceMock.getComments).toHaveBeenCalledWith({ pageIndex: '0', pageSize: '10' }, 'post123');
    expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(2);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user456');
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user789');

    const expectedResponse = [
      {
        _id: 'comment1',
        content: 'This is a comment',
        createdAt: mockComments[0].createdAt,
        createdBy: {
          _id: 'user456',
          firstName: 'Jane',
          lastName: 'Doe',
          preferences: {
            image: 'image1.png',
          },
        },
        likes: ['user123', 'user789'],
        likeCount: 2,
        liked: true,
        me: false,
      },
      {
        _id: 'comment2',
        content: 'This is another comment',
        createdAt: mockComments[1].createdAt,
        createdBy: {
          _id: 'user789',
          firstName: 'John',
          lastName: 'Smith',
          preferences: {
            image: 'image2.png',
          },
        },
        likes: [],
        likeCount: 0,
        liked: false,
        me: false,
      },
    ];

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'Comments retrieved successfully',
      success: true,
    });
  });

  it('should handle post not found error', async () => {
    const command: GetCommentsCommandRequest = {
      pageIndex: '0',
      pageSize: '10',
      postId: 'post123',
    };

    // Setup mock implementation
    (postServiceMock.getComments as jest.Mock).mockRejectedValue(new NotFoundException('Post not found'));

    // Execute command and catch error
    await expect(getCommentsCommand(command, resMock as Response)).rejects.toThrow(NotFoundException);

    // Assertions
    expect(postServiceMock.getComments).toHaveBeenCalledWith({ pageIndex: '0', pageSize: '10' }, 'post123');
    expect(userRepositoryMock.findOne).not.toHaveBeenCalled();
  });

  it('should handle user not found error', async () => {
    const command: GetCommentsCommandRequest = {
      pageIndex: '0',
      pageSize: '10',
      postId: 'post123',
    };

    const mockComments = [
      {
        _id: 'comment1',
        content: 'This is a comment',
        createdAt: new Date(),
        createdBy: 'user456',
        likes: ['user123', 'user789'],
      },
    ];

    // Setup mock implementations
    (postServiceMock.getComments as jest.Mock).mockResolvedValue(mockComments);
    (userRepositoryMock.findOne as jest.Mock).mockRejectedValue(new NotFoundException('User not found'));

    // Execute command and catch error
    await expect(getCommentsCommand(command, resMock as Response)).rejects.toThrow(NotFoundException);

    // Assertions
    expect(postServiceMock.getComments).toHaveBeenCalledWith({ pageIndex: '0', pageSize: '10' }, 'post123');
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user456');
  });
});
