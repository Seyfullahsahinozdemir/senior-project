import { makeUpdateCommand } from '../update.user.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IAuthService, IUserService } from '@application/interfaces';
import { IImageRepository, IUserRepository } from '@application/persistence';
import { UpdateUserDTO } from '@application/dto/user/update.user';
import { NotFoundException } from '@application/exceptions';
import { validate } from '../update.user.command.validator';

// Mock dependencies
const userServiceMock: Partial<IUserService> = {
  updateUser: jest.fn(),
};

const imageRepositoryMock: Partial<IImageRepository> = {
  find: jest.fn(),
};

const userRepositoryMock: Partial<IUserRepository> = {};
const authServiceMock: Partial<IAuthService> = {};

const dependenciesMock: Pick<Dependencies, 'userService' | 'imageRepository' | 'userRepository' | 'authService'> = {
  userService: userServiceMock as IUserService,
  imageRepository: imageRepositoryMock as IImageRepository,
  userRepository: userRepositoryMock as IUserRepository,
  authService: authServiceMock as IAuthService,
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
jest.mock('../update.user.command.validator', () => ({
  validate: jest.fn(),
}));

describe('makeUpdateCommand', () => {
  const updateCommand = makeUpdateCommand(dependenciesMock);

  it('should update user successfully', async () => {
    // Mock command parameters
    const command: UpdateUserDTO = {
      // Sahte kullanıcı güncelleme verileri
      firstName: 'John',
      lastName: 'Doe',
      preferences: {
        gender: 'male',
        phone: '1234567890',
        address: '123 Test St, Testville',
        about: 'Test user',
        image: {
          filename: 'testImage.jpg',
          mimetype: 'image/jpeg',
        },
      },
    };

    // Mock validate function to resolve without error
    (validate as jest.Mock).mockImplementation(() => {
      return Promise.resolve();
    });
    // Mock imageRepository.find to resolve with a fake image
    (imageRepositoryMock.find as jest.Mock).mockResolvedValue({
      // Sahte görüntü verileri
    });

    // Mock userService.updateUser result
    const updatedUser = {
      // Sahte kullanıcı güncellenmiş verileri
      id: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      preferences: {
        gender: 'male',
        phone: '1234567890',
        address: '123 Test St, Testville',
        about: 'Test user',
        image: {
          filename: 'testImage.jpg',
          mimetype: 'image/jpeg',
        },
      },
    };
    (userServiceMock.updateUser as jest.Mock).mockResolvedValue(updatedUser);

    // Execute command
    await updateCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(imageRepositoryMock.find).toHaveBeenCalledWith({ fileId: command.preferences.image.filename });
    expect(userServiceMock.updateUser).toHaveBeenCalledWith(command);
    expect(resMock.json).toHaveBeenCalledWith({ data: { user: updatedUser }, message: 'success', success: true });
  });

  it('should throw NotFoundException if image is not found', async () => {
    // Mock command parameters with image filename
    const command: UpdateUserDTO = {
      preferences: {
        image: {
          filename: 'nonExistingImage.jpg',
        },
      },
    };

    // Mock validate function to resolve without error
    (validate as jest.Mock).mockImplementation(() => {
      return Promise.resolve();
    });
    // Mock imageRepository.find to resolve with null (image not found)
    (imageRepositoryMock.find as jest.Mock).mockResolvedValue(null);

    // Execute command and catch the error
    try {
      await updateCommand(command, resMock as Response);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Image not found');
    }
  });
});
