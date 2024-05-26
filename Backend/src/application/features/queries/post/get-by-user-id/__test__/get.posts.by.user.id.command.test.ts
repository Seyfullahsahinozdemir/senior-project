import { makeGetPostsByUserIdCommand } from '../get.posts.by.user.id.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { validate } from '../get.posts.by.user.id.command.validator';
import { IAuthService, IImageService, IPostService } from '@application/interfaces';
import { IItemRepository, IUserRepository } from '@application/persistence';
import { Post } from '@domain/entities';
import { ObjectId } from 'mongodb';
// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  getPostsByUserId: jest.fn(),
};
const userRepositoryMock: Partial<IUserRepository> = {
  findOne: jest.fn(),
};
const imageServiceMock: Partial<IImageService> = {
  findFileIdByName: jest.fn(),
};
const itemRepositoryMock: Partial<IItemRepository> = {
  findOne: jest.fn(),
};
const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123', // Mock current user ID
};

const dependenciesMock: Pick<
  Dependencies,
  'postService' | 'userRepository' | 'imageService' | 'itemRepository' | 'authService'
> = {
  postService: postServiceMock as IPostService,
  userRepository: userRepositoryMock as IUserRepository,
  imageService: imageServiceMock as IImageService,
  itemRepository: itemRepositoryMock as IItemRepository,
  authService: authServiceMock as IAuthService,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock the validate function
jest.mock('../get.posts.by.user.id.command.validator.ts', () => ({
  validate: jest.fn(),
}));

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Mock Post entity methods
const mockPostMethods = {
  createEntity: jest.fn(),
  updateEntity: jest.fn(),
  deleteEntity: jest.fn(),
};

describe('getPostsByUserIdCommand', () => {
  const getPostsByUserIdCommand = makeGetPostsByUserIdCommand(dependenciesMock);

  it('should return posts by user ID successfully', async () => {
    // Mock command parameters
    const command = { pageIndex: '0', pageSize: '10', userId: 'user123' };

    // Mock posts
    const mockPosts: Post[] = [
      {
        _id: new ObjectId(),
        content: 'Content 1',
        createdAt: new Date('2024-05-25'),
        updatedAt: new Date(),
        createdBy: 'user123', // Use valid user ID
        items: ['item123'], // Use valid item ID
        likes: ['user123'], // Mock that the current user liked this post
        comments: [
          {
            _id: new ObjectId(),
            content: 'Comment 1',
            createdBy: 'user123', // Use valid user ID
            createdAt: new Date(),
            likes: [],
          },
        ],
        ...mockPostMethods,
      },
    ];

    // Mock user
    const mockUser = {
      _id: 'user123',
      username: 'username1',
      firstName: 'First',
      lastName: 'Last',
      preferences: { image: 'user_image.jpg' },
    };

    // Mock item
    const mockItem = {
      _id: new ObjectId(),
      image: { filename: 'item_image', fileId: '' },
    };

    // Setup mock implementations
    (postServiceMock.getPostsByUserId as jest.Mock).mockResolvedValue(mockPosts);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (itemRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockItem);
    (imageServiceMock.findFileIdByName as jest.Mock).mockResolvedValue('user_image.jpg');

    // Execute command
    await getPostsByUserIdCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(postServiceMock.getPostsByUserId).toHaveBeenCalledWith({ pageIndex: '0', pageSize: '10' }, 'user123');
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user123');
    expect(itemRepositoryMock.findOne).toHaveBeenCalledWith('item123');
    expect(imageServiceMock.findFileIdByName).toHaveBeenCalledWith('item_image.jpg');

    const expectedResponse = [
      {
        _id: mockPosts[0]._id,
        content: 'Content 1',
        createdAt: new Date('2024-05-25'),
        likeCount: 1,
        commentCount: 1,
        user: {
          firstName: 'First',
          lastName: 'Last',
          username: 'username1',
          image: 'user_image.jpg',
        },
        items: [{ image: { filename: 'user_image.jpg' } }],
        comments: mockPosts[0].comments,
        liked: true,
        me: true, // Assuming the current user is the creator of this post
      },
    ];

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'Posts retrieved successfully',
      success: true,
    });
  });
});
