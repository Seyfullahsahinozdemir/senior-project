import { makeGetUsersByUsernameCommand, GetUsersByUsernameCommandRequest } from '../get.users.by.username.command';
import { Dependencies } from '@infrastructure/di';
import { validate } from '../get.users.by.username.command.validator';
import { Response } from 'express';
import { IUserService } from '@application/interfaces';
import CustomResponse from '@application/interfaces/custom.response';

// Mock dependencies
const userServiceMock: Partial<IUserService> = {
  listUsersByUsername: jest.fn(),
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
      return {
        json: () => res.json(this.data),
      };
    }
  },
}));

// Mock validate function
jest.mock('../get.users.by.username.command.validator', () => ({
  validate: jest.fn(),
}));

describe('makeGetUsersByUsernameCommand', () => {
  const getUsersByUsernameCommand = makeGetUsersByUsernameCommand(dependenciesMock);

  it('should return users by username successfully', async () => {
    // Mock command parameters
    const command: GetUsersByUsernameCommandRequest = {
      pageIndex: 1,
      pageSize: 10,
      key: 'username',
    };

    // Mock userService.listUsersByUsername result
    const userList = [
      { id: '1', username: 'username1' },
      { id: '2', username: 'username2' },
    ];
    (userServiceMock.listUsersByUsername as jest.Mock).mockResolvedValue(userList);

    // Execute command
    await getUsersByUsernameCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(userServiceMock.listUsersByUsername).toHaveBeenCalledWith(command);
    expect(resMock.json).toHaveBeenCalledWith(new CustomResponse({ users: userList }, 'success'));
  });
});
