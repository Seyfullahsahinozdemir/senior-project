import { Response } from 'express';
import { makeGetItemsByCurrentUserAndCategoryCommand } from '../get.items.by.current.user.and.category.command';
import { validate } from '../get.items.by.current.user.and.category.command.validator';
import CustomResponse from '@application/interfaces/custom.response';
import { IItemService, IImageService, IAuthService } from '@application/interfaces';
import { MimetypeEnum } from '@application/enums/mimetype.enum';
import { IItemRepository, IUserRepository } from '@application/persistence';

// Mock dependencies
const itemServiceMock: Partial<IItemService> = {
  getItemsByCurrentUserAndCategory: jest.fn(),
};
const userRepositoryMock: Partial<IUserRepository> = {
  findOne: jest.fn(),
};
const imageServiceMock: Partial<IImageService> = {
  findFileIdByName: jest.fn(),
  generatePublicUrl: jest.fn(),
};
const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123',
};
const itemRepositoryMock: Partial<IItemRepository> = {
  update: jest.fn(),
};

const dependenciesMock = {
  itemService: itemServiceMock as IItemService,
  userRepository: userRepositoryMock as IUserRepository,
  imageService: imageServiceMock as IImageService,
  authService: authServiceMock as IAuthService,
  itemRepository: itemRepositoryMock as IItemRepository,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock the validate function
jest.mock('../get.items.by.current.user.and.category.command.validator', () => ({
  validate: jest.fn(),
}));

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('getItemsByCurrentUserAndCategoryCommand', () => {
  const getItemsByCurrentUserAndCategoryCommand = makeGetItemsByCurrentUserAndCategoryCommand(dependenciesMock);

  it('should return items successfully', async () => {
    const command = { pageSize: '10', pageIndex: '0', categoryName: 'category1' };

    const mockItems = [
      {
        _id: 'item1',
        urlName: 'url1',
        description: 'desc1',
        title: 'title1',
        topCategory: 'category1',
        subCategories: ['subCat1'],
        image: { filename: 'file1', mimetype: MimetypeEnum.JPEG, public: false, fileId: '' },
        createdAt: new Date(),
        createdBy: 'user456',
      },
    ];

    const mockUser = {
      _id: 'user456',
      username: 'username456',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      favoriteItems: ['item1'],
    };

    // Setup mock implementations
    (itemServiceMock.getItemsByCurrentUserAndCategory as jest.Mock).mockResolvedValue(mockItems);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (imageServiceMock.findFileIdByName as jest.Mock).mockResolvedValue('fileId123');
    (imageServiceMock.generatePublicUrl as jest.Mock).mockResolvedValue(undefined);

    // Execute command
    await getItemsByCurrentUserAndCategoryCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(itemServiceMock.getItemsByCurrentUserAndCategory).toHaveBeenCalledWith(
      { pageIndex: command.pageIndex, pageSize: command.pageSize },
      command.categoryName,
    );
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user456');
    expect(imageServiceMock.findFileIdByName).toHaveBeenCalledWith('file1.jpg');
    expect(imageServiceMock.generatePublicUrl).toHaveBeenCalledWith('fileId123');
    expect(itemRepositoryMock.update).toHaveBeenCalledWith('item1', expect.any(Object));

    const expectedResponse = [
      {
        _id: 'item1',
        urlName: 'url1',
        description: 'desc1',
        title: 'title1',
        topCategory: 'category1',
        subCategories: ['subCat1'],
        image: { fileId: 'fileId123', filename: 'file1', mimetype: MimetypeEnum.JPEG },
        createdAt: mockItems[0].createdAt,
        createdBy: {
          _id: 'user456',
          username: 'username456',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
        },
        me: false,
        onFavorite: true,
      },
    ];

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'success',
      success: true,
    });
  });

  it('should handle validation errors', async () => {
    const command = { pageSize: '10', pageIndex: 'invalid', categoryName: 'category1' };

    const validationError = new Error('Validation error');
    (validate as jest.Mock).mockImplementation(() => {
      throw validationError;
    });

    // Execute command and catch error
    await expect(getItemsByCurrentUserAndCategoryCommand(command, resMock as Response)).rejects.toThrow(
      validationError,
    );

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(itemServiceMock.getItemsByCurrentUserAndCategory).not.toHaveBeenCalled();

    const customResponse = new CustomResponse(null, 'Validation failed.');
    customResponse.error400(resMock as Response);

    expect(resMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: null,
        message: 'Validation failed.',
        success: false,
      }),
    );
    expect(resMock.status).toHaveBeenCalledWith(400);
  });

  it('should handle itemService.getItemsByCurrentUserAndCategory errors', async () => {
    const command = { pageSize: '10', pageIndex: '0', categoryName: 'category1' };

    const serviceError = new Error('Service error');
    (validate as jest.Mock).mockResolvedValue(undefined);
    (itemServiceMock.getItemsByCurrentUserAndCategory as jest.Mock).mockRejectedValue(serviceError);

    // Execute command and catch error
    await expect(getItemsByCurrentUserAndCategoryCommand(command, resMock as Response)).rejects.toThrow(serviceError);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(itemServiceMock.getItemsByCurrentUserAndCategory).toHaveBeenCalledWith(
      { pageIndex: command.pageIndex, pageSize: command.pageSize },
      command.categoryName,
    );
  });
});
