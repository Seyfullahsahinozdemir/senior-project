import { makeFollowCommand, FollowCommandRequest } from '../follow.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IUserService, IAuthService } from '@application/interfaces';
import { validate } from '../follow.command.validator';
import { ValidationException } from '@application/exceptions';

// Mock dependencies
const userServiceMock: Partial<IUserService> = {
  follow: jest.fn(),
};

const authServiceMock: Partial<IAuthService> = {
  currentUserId: 'user123',
};

const dependenciesMock: Pick<Dependencies, 'userService' | 'authService'> = {
  userService: userServiceMock as IUserService,
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
jest.mock('../follow.command.validator', () => ({
  validate: jest.fn(),
}));

describe('makeFollowCommand', () => {
  const followCommand = makeFollowCommand(dependenciesMock);

  it('should follow a user successfully', async () => {
    // Mock command parameters
    const command: FollowCommandRequest = {
      targetUserId: 'targetUser123',
    };

    // Mock validate function to resolve without error
    (validate as jest.Mock).mockImplementation(() => {
      return Promise.resolve();
    });

    // Execute command
    await followCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(userServiceMock.follow).toHaveBeenCalledWith('user123', 'targetUser123');
    expect(resMock.json).toHaveBeenCalledWith({ data: null, message: 'Follow success', success: true });
  });

  it('should throw ValidationException if validation fails', async () => {
    // Mock command parameters
    const command: FollowCommandRequest = {
      targetUserId: 'targetUser123',
    };

    // Mock validate function to reject with ValidationException
    (validate as jest.Mock).mockRejectedValue(new ValidationException('Validation failed'));

    // Execute command and catch the error
    try {
      await followCommand(command, resMock as Response);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(ValidationException);
      expect(error.message).toBe('Validation failed');
    }
  });
});
