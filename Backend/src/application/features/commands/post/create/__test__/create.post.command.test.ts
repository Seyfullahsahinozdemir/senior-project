import { makeCreatePostCommand, CreatePostCommandRequest } from '../create.post.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IPostService } from '@application/interfaces';
import { NotFoundException } from '@application/exceptions';
import { IItemRepository } from '@application/persistence';
import { IAuthService } from '@application/interfaces';
import { validate } from '../create.post.command.validator';
// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  createPost: jest.fn(),
};

const itemRepositoryMock: Partial<IItemRepository> = {
  findOne: jest.fn(),
};

const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123',
};

const dependenciesMock: Pick<Dependencies, 'postService' | 'itemRepository' | 'authService'> = {
  postService: postServiceMock as IPostService,
  itemRepository: itemRepositoryMock as IItemRepository,
  authService: authServiceMock as IAuthService,
};

// Mock Response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock CustomResponse
jest.mock('@application/interfaces/custom.response', () => ({
  __esModule: true,
  default: class CustomResponseMock {
    constructor(private data: any, private message: string) {}
    created(res: Response) {
      return res.json({ data: this.data, message: this.message, success: true });
    }
  },
}));

// Mock validate function
jest.mock('../create.post.command.validator', () => ({
  validate: jest.fn(),
}));

// Mock item data
const mockItem1 = { _id: 'item1', name: 'Item 1' };
const mockItem2 = { _id: 'item2', name: 'Item 2' };
const mockItems = [mockItem1, mockItem2];

describe('makeCreatePostCommand', () => {
  const createPostCommand = makeCreatePostCommand(dependenciesMock);

  it('should create a post successfully', async () => {
    // Mock command parameters
    const command: CreatePostCommandRequest = {
      content: 'Test post content',
      items: ['item1', 'item2'],
    };

    // Mock itemRepository findOne method to return mock items
    (itemRepositoryMock.findOne as jest.Mock).mockImplementation((id: string) => {
      if (id === 'item1') {
        return mockItem1;
      } else if (id === 'item2') {
        return mockItem2;
      } else {
        return null;
      }
    });

    // Mock postService.createPost result
    const mockPost = { _id: 'post1', content: 'Test post content', items: mockItems };
    (postServiceMock.createPost as jest.Mock).mockResolvedValue(mockPost);

    // Execute command
    await createPostCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(itemRepositoryMock.findOne).toHaveBeenCalledTimes(2);
    expect(postServiceMock.createPost).toHaveBeenCalledWith({
      content: command.content,
      items: command.items,
    });
    expect(resMock.json).toHaveBeenCalledWith({
      data: mockPost,
      message: 'Post created successfully',
      success: true,
    });
  });

  it('should throw NotFoundException if item does not exist', async () => {
    // Mock command parameters with invalid item ID
    const command: CreatePostCommandRequest = {
      content: 'Test post content',
      items: ['invalidItem'],
    };

    // Mock itemRepository findOne method to return null for invalid item ID
    (itemRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

    // Execute command and catch the error
    try {
      await createPostCommand(command, resMock as Response);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Item 'invalidItem' does not exist.`);
    }
  });
});
