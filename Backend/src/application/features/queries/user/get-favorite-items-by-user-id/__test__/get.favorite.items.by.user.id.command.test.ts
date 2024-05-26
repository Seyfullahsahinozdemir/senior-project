import { makeGetFavoriteItemsByUserIdCommand } from '../get.favorite.items.by.user.id.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IUserService, IImageService, IAuthService } from '@application/interfaces';
import { User } from '@domain/entities';
import { ObjectId } from 'mongodb';
import { GetFavoriteItemDTO } from '@application/dto/user/get.favorite.item';
import { MimetypeEnum } from '@application/enums/mimetype.enum';
import { IUserRepository } from '@application/persistence';

// Mock dependencies
const userServiceMock: Partial<IUserService> = {
  getFavoriteItemsByUserId: jest.fn(),
};
const userRepositoryMock: Partial<IUserRepository> = {
  findOne: jest.fn(),
};
const imageServiceMock: Partial<IImageService> = {
  findFileIdByName: jest.fn(),
};
const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123', // Mock current user ID
};

const dependenciesMock: Pick<Dependencies, 'userService' | 'userRepository' | 'imageService' | 'authService'> = {
  userService: userServiceMock as IUserService,
  userRepository: userRepositoryMock as IUserRepository,
  imageService: imageServiceMock as IImageService,
  authService: authServiceMock as IAuthService,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock the validate function
jest.mock('../get.favorite.items.by.user.id.command.validator.ts', () => ({
  validate: jest.fn(),
}));

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Mock User entity methods
const mockUserMethods = {
  createEntity: jest.fn(),
  updateEntity: jest.fn(),
  deleteEntity: jest.fn(),
};

describe('getFavoriteItemsByUserIdCommand', () => {
  const getFavoriteItemsByUserIdCommand = makeGetFavoriteItemsByUserIdCommand(dependenciesMock);

  it('should return favorite items by user ID successfully', async () => {
    // Mock command parameters
    const command: GetFavoriteItemDTO = { userId: 'user123' };

    // Mock favorite items
    const mockFavoriteItems = [
      {
        _id: new ObjectId(),
        urlName: 'item1',
        description: 'Description 1',
        title: 'Title 1',
        topCategory: 'Category 1',
        subCategories: ['Subcategory 1'],
        image: {
          filename: 'image1',
          mimetype: MimetypeEnum.JPEG,
        },
        createdAt: new Date('2024-05-25'),
        createdBy: new ObjectId(),
        ...mockUserMethods,
      },
    ];

    // Mock user
    const mockUser: User = new User('First', 'Last', 'username123', 'user@example.com', 'password123');
    mockUser._id = new ObjectId();
    mockUser.favoriteItems = [mockFavoriteItems[0]._id];

    // Setup mock implementations
    (userServiceMock.getFavoriteItemsByUserId as jest.Mock).mockResolvedValue(mockFavoriteItems);
    (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockUser);
    (imageServiceMock.findFileIdByName as jest.Mock).mockResolvedValue('file123');

    // Execute command
    await getFavoriteItemsByUserIdCommand(command, resMock as Response);

    // Assertions
    expect(userServiceMock.getFavoriteItemsByUserId).toHaveBeenCalledWith(command);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(mockFavoriteItems[0].createdBy);
    expect(imageServiceMock.findFileIdByName).toHaveBeenCalledWith('image1.jpg');

    const expectedResponse = [
      {
        _id: mockFavoriteItems[0]._id,
        urlName: 'item1',
        description: 'Description 1',
        title: 'Title 1',
        topCategory: 'Category 1',
        subCategories: ['Subcategory 1'],
        image: { fileId: 'file123', fileName: 'image1', mimetype: MimetypeEnum.JPEG },
        createdAt: new Date('2024-05-25'),
        createdBy: {
          _id: mockUser._id,
          username: 'username123',
          firstName: 'First',
          lastName: 'Last',
          email: 'user@example.com',
        },
        me: false,
        onFavorite: true,
      },
    ];

    expect(resMock.json).toHaveBeenCalledWith({
      data: expectedResponse,
      message: 'Success.',
      success: true,
    });
  });
});
