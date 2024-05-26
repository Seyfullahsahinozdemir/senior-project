import { makeGetPostByIdCommand } from '../get.post.by.id.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IPostService, IImageService, IAuthService } from '@application/interfaces';
import { Post } from '@domain/entities';
import { ObjectId } from 'mongodb';
import { validate } from '../get.post.by.id.command.validator';
import { IItemRepository, IUserRepository } from '@application/persistence';

// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  getPostById: jest.fn(),
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
jest.mock('../get.post.by.id.command.validator.ts', () => ({
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

describe('getPostByIdCommand', () => {
  const getPostByIdCommand = makeGetPostByIdCommand(dependenciesMock);

  it('should return post by ID successfully', async () => {
    // Mock command parameters
    const command = { postId: 'post123' };

    // Mock post
    const mockPost: Post = {
      _id: new ObjectId(),
      content: 'Content 1',
      createdAt: new Date('2024-05-25'),
      updatedAt: new Date(),
      createdBy: 'user123', // Use valid user ID
      items: [new ObjectId().toString()], // Use valid ObjectId string
      likes: [new ObjectId().toString()], // Use valid ObjectId string
      comments: [
        {
          _id: new ObjectId(),
          content: 'Comment 1',
          createdBy: new ObjectId().toString(), // Use valid ObjectId string
          createdAt: new Date(),
          likes: [],
        },
      ],
      ...mockPostMethods,
    };

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
    (postServiceMock.getPostById as jest.Mock).mockResolvedValue(mockPost);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (itemRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockItem);
    (imageServiceMock.findFileIdByName as jest.Mock).mockResolvedValue('user_image.jpg');

    // Execute command
    await getPostByIdCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(postServiceMock.getPostById).toHaveBeenCalledWith('post123');
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user123');
    expect(itemRepositoryMock.findOne).toHaveBeenCalledWith(mockPost.items[0]);
    expect(imageServiceMock.findFileIdByName).toHaveBeenCalledWith('item_image.jpg');

    const expectedResponse = {
      _id: mockPost._id,
      content: mockPost.content,
      createdAt: mockPost.createdAt,
      likeCount: 1,
      commentCount: 1,
      user: {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        username: mockUser.username,
        image: mockUser.preferences?.image,
      },
      items: [{ image: { filename: 'user_image.jpg' } }],
      comments: mockPost.comments,
      liked: false,
    };

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'Posts retrieved successfully',
      success: true,
    });
  });
});
