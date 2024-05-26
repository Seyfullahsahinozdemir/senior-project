import { makeGetItemsByUserIdCommand } from '../get.items.by.user.id.command';
import { Dependencies } from '@infrastructure/di';
import { IItemService, IImageService, IAuthService } from '@application/interfaces';
import { Response } from 'express';
import { IItemRepository, IUserRepository } from '@application/persistence';
import { validate } from '../get.items.by.user.id.command.validator';

// Mock dependencies
const itemServiceMock: Partial<IItemService> = {
  getItemsByUserId: jest.fn(),
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

const dependenciesMock: Pick<
  Dependencies,
  'itemService' | 'userRepository' | 'imageService' | 'authService' | 'itemRepository'
> = {
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
jest.mock('../get.items.by.user.id.command.validator.ts', () => ({
  validate: jest.fn(),
}));

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('getItemsByUserIdCommand', () => {
  const getItemsByUserIdCommand = makeGetItemsByUserIdCommand(dependenciesMock);

  it('should return items successfully', async () => {
    // Mock command parameters
    const command = { pageSize: '10', pageIndex: '0', userId: 'user123' };

    // Mock items
    const mockItems = [
      {
        _id: 'item1',
        urlName: 'url1',
        description: 'desc1',
        title: 'title1',
        topCategory: 'category1',
        subCategories: ['subCat1'],
        image: { filename: 'file1', mimetype: 'image/jpeg', public: false, fileId: '' },
        createdAt: new Date(),
        createdBy: 'user123',
      },
    ];

    // Mock user
    const mockUser = {
      _id: 'user123',
      username: 'username123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      favoriteItems: ['item1'],
    };

    // Setup mock implementations
    (itemServiceMock.getItemsByUserId as jest.Mock).mockResolvedValue(mockItems);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (imageServiceMock.findFileIdByName as jest.Mock).mockResolvedValue('fileId123');
    (imageServiceMock.generatePublicUrl as jest.Mock).mockResolvedValue(undefined);

    // Execute command
    await getItemsByUserIdCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(itemServiceMock.getItemsByUserId).toHaveBeenCalledWith(
      { pageIndex: command.pageIndex, pageSize: command.pageSize },
      command.userId,
    );
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith('user123');
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
        image: { fileId: 'fileId123', filename: 'file1', mimetype: 'image/jpeg' },
        createdAt: mockItems[0].createdAt,
        createdBy: {
          _id: 'user123',
          username: 'username123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        me: true,
        onFavorite: true,
      },
    ];

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'success',
      success: true,
    });
  });
});
