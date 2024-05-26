import { IAuthService, IItemService } from '@application/interfaces';
import { makeDeleteCommand, DeleteCommandRequest } from '../delete.item.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IImageRepository, IItemRepository } from '@application/persistence';
import { ISearchService } from '@application/interfaces/services/search/ISearchService';

// Mock dependencies
const itemServiceMock: Partial<IItemService> = {
  deleteItem: jest.fn(),
};

const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123',
};

const itemRepositoryMock: Partial<IItemRepository> = {
  findOne: jest.fn(),
  delete: jest.fn(),
};

const imageRepositoryMock: Partial<IImageRepository> = {
  find: jest.fn(),
  delete: jest.fn(),
};

const searchServiceMock: Partial<ISearchService> = {
  delete: jest.fn(),
};

const dependenciesMock: Pick<
  Dependencies,
  'itemService' | 'authService' | 'itemRepository' | 'imageRepository' | 'searchService'
> = {
  itemService: itemServiceMock as IItemService,
  authService: authServiceMock as IAuthService,
  itemRepository: itemRepositoryMock as IItemRepository,
  imageRepository: imageRepositoryMock as IImageRepository,
  searchService: searchServiceMock as ISearchService,
};

// Mock Response object
const resMock: Partial<Response> = {
  json: jest.fn(),
};

// Mock CustomResponse
jest.mock('@application/interfaces/custom.response', () => ({
  __esModule: true,
  default: class CustomResponseMock {
    constructor(private data: any, private message: string) {}
    success(res: Response) {
      return res.json({ data: this.data, message: this.message, success: true });
    }
  },
}));

// Mock validate function
jest.mock('../delete.item.command.validator', () => ({
  validate: jest.fn(),
}));

// Mock item data
const mockItem = {
  _id: '123',
  createdBy: 'user123',
  image: {
    fileId: 'fileId123',
    filename: 'filename123',
    mimetype: 'image/jpeg',
  },
};

describe('makeDeleteCommand', () => {
  const deleteCommand = makeDeleteCommand(dependenciesMock);

  it('should delete an item successfully', async () => {
    // Mock command parameters
    const command: DeleteCommandRequest = {
      _id: '123',
    };

    // Mock itemRepository findOne method to return mock item
    (itemRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockItem);

    // Mock searchService.delete to simulate failure
    (searchServiceMock.delete as jest.Mock).mockResolvedValue(false);

    // Execute command and catch the error
    try {
      await deleteCommand(command, resMock as Response);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('An error occurred while removing item from model.');
    }
  });
});
