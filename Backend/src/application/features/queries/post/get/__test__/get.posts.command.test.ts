import { makeGetPostsCommand } from '../get.posts.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IPostService, IImageService } from '@application/interfaces';
import { Post } from '@domain/entities';
import { validate } from '../get.posts.command.validator';
import { ObjectId } from 'mongodb';
import { IItemRepository, IUserRepository } from '@application/persistence';

// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  getPosts: jest.fn(),
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

const dependenciesMock: Pick<Dependencies, 'postService' | 'userRepository' | 'imageService' | 'itemRepository'> = {
  postService: postServiceMock as IPostService,
  userRepository: userRepositoryMock as IUserRepository,
  imageService: imageServiceMock as IImageService,
  itemRepository: itemRepositoryMock as IItemRepository,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock the validate function
jest.mock('../get.posts.command.validator.ts', () => ({
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

describe('getPostsCommand', () => {
  const getPostsCommand = makeGetPostsCommand(dependenciesMock);

  it('should return posts successfully', async () => {
    // Mock command parameters
    const command = { pageIndex: '0', pageSize: '10' };

    // Mock posts
    const mockPosts: Post[] = [
      {
        _id: new ObjectId(),
        content: 'Content 1',
        createdAt: new Date('2024-05-25'),
        updatedAt: new Date(),
        createdBy: new ObjectId().toString(), // Use valid ObjectId string
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
      },
    ];

    // Mock user
    const mockUser = {
      _id: new ObjectId(),
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
    (postServiceMock.getPosts as jest.Mock).mockResolvedValue(mockPosts);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (itemRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockItem);
    (imageServiceMock.findFileIdByName as jest.Mock)
      .mockResolvedValueOnce('user_image.jpg') // User image
      .mockResolvedValueOnce('fileId1'); // Item image

    // Execute command
    await getPostsCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(postServiceMock.getPosts).toHaveBeenCalledWith(command);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(mockPosts[0].createdBy);
    expect(imageServiceMock.findFileIdByName).toHaveBeenCalledWith('item_image.jpg');
    expect(itemRepositoryMock.findOne).toHaveBeenCalledWith(mockPosts[0].items[0]);

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
      },
    ];

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'Posts retrieved successfully',
      success: true,
    });
  });
});
