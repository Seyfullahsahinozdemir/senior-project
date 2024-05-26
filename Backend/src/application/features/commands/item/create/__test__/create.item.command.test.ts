import { makeCreateCommand, CreateCommandRequest } from '../create.item.command';
import { Dependencies } from '@infrastructure/di';
import { validate } from '../create.item.command.validator';
import { Response } from 'express';
import { IImageService, IItemService } from '@application/interfaces';
import { ICategoryRepository, IImageRepository } from '@application/persistence';
import { ISearchService } from '@application/interfaces/services/search/ISearchService';

// Mock dependencies
const itemServiceMock: Partial<IItemService> = {
  createItem: jest.fn(),
};

const categoryRepositoryMock: Partial<ICategoryRepository> = {
  find: jest.fn(),
};

const imageRepositoryMock: Partial<IImageRepository> = {
  find: jest.fn(),
};

const imageServiceMock: Partial<IImageService> = {
  getImage: jest.fn(),
};

const searchServiceMock: Partial<ISearchService> = {
  add: jest.fn(),
};

const dependenciesMock: Pick<
  Dependencies,
  'itemService' | 'categoryRepository' | 'imageRepository' | 'imageService' | 'searchService'
> = {
  itemService: itemServiceMock as IItemService,
  categoryRepository: categoryRepositoryMock as ICategoryRepository,
  imageRepository: imageRepositoryMock as IImageRepository,
  imageService: imageServiceMock as IImageService,
  searchService: searchServiceMock as ISearchService,
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
jest.mock('../create.item.command.validator', () => ({
  validate: jest.fn(),
}));

// Mock category and image data
const mockCategories = [{ name: 'TopCategory', description: 'DESCRIPTION' }];
const mockImage = { fileId: '123', filename: 'test.jpg', mimetype: 'image/jpeg' };

describe('makeCreateCommand', () => {
  const createCommand = makeCreateCommand(dependenciesMock);

  it('should create an item successfully', async () => {
    // Mock command parameters
    const command: CreateCommandRequest = {
      urlName: 'url',
      description: 'Description',
      title: 'Title',
      topCategory: 'TopCategory',
      subCategories: ['SubCategory1', 'SubCategory2'],
      image: mockImage,
    };

    // Mock categoryRepository find method to return mock categories
    (categoryRepositoryMock.find as jest.Mock).mockResolvedValue(mockCategories);

    // Mock imageRepository find method to return mock image
    (imageRepositoryMock.find as jest.Mock).mockResolvedValue([mockImage]);

    // Mock imageService getImage method to return image buffer
    (imageServiceMock.getImage as jest.Mock).mockResolvedValue(Buffer.from('IMAGE_BUFFER'));

    // Mock searchService add method
    (searchServiceMock.add as jest.Mock).mockResolvedValue(true);

    // Mock itemService createItem method to return created item
    const mockCreatedItem = { id: '123', title: 'Title', description: 'Description', image: mockImage };
    (itemServiceMock.createItem as jest.Mock).mockResolvedValue(mockCreatedItem);

    // Execute command
    await createCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(categoryRepositoryMock.find).toHaveBeenCalledWith({ name: 'TopCategory', description: 'top-category' });
    expect(imageRepositoryMock.find).toHaveBeenCalledWith({ fileId: '123' });
    expect(imageServiceMock.getImage).toHaveBeenCalledWith('123');
    expect(searchServiceMock.add).toHaveBeenCalledWith(Buffer.from('IMAGE_BUFFER'));
    expect(itemServiceMock.createItem).toHaveBeenCalledWith({
      urlName: 'url',
      description: 'Description',
      title: 'Title',
      topCategory: 'TopCategory',
      subCategories: ['SubCategory1', 'SubCategory2'],
      image: mockImage,
    });
    expect(resMock.json).toHaveBeenCalledWith({
      data: mockCreatedItem,
      message: 'Item created successful',
      success: true,
    });
  });
});
