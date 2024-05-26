import { makeAddFavoriteItemCommand, AddFavoriteItemCommandRequest } from '../add.favorite.item.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IUserService } from '@application/interfaces';
import { NotFoundException } from '@application/exceptions';
import { validate } from '../add.favorite.item.command.validator';

// Mock dependencies
const userServiceMock: Partial<IUserService> = {
  addFavoriteItem: jest.fn(),
};

const dependenciesMock: Pick<Dependencies, 'userService'> = {
  userService: userServiceMock as IUserService,
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
jest.mock('../add.favorite.item.command.validator', () => ({
  validate: jest.fn(),
}));

describe('makeAddFavoriteItemCommand', () => {
  const addFavoriteItemCommand = makeAddFavoriteItemCommand(dependenciesMock);

  it('should add an item to favorite list successfully', async () => {
    // Mock command parameters
    const command: AddFavoriteItemCommandRequest = {
      itemId: '123',
    };

    // Mock userService.addFavoriteItem result
    (userServiceMock.addFavoriteItem as jest.Mock).mockResolvedValue(undefined);

    // Execute command
    await addFavoriteItemCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(userServiceMock.addFavoriteItem).toHaveBeenCalledWith(command.itemId);
    expect(resMock.json).toHaveBeenCalledWith({
      data: null,
      message: 'Item successful added to favorite list.',
      success: true,
    });
  });

  it('should throw NotFoundException if item does not exist', async () => {
    // Mock command parameters with invalid item ID
    const command: AddFavoriteItemCommandRequest = {
      itemId: 'invalidItemId',
    };

    // Mock userService.addFavoriteItem to throw NotFoundException for invalid item ID
    (userServiceMock.addFavoriteItem as jest.Mock).mockRejectedValue(new NotFoundException('Item not found'));

    // Execute command and catch the error
    try {
      await addFavoriteItemCommand(command, resMock as Response);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Item not found');
    }
  });
});
