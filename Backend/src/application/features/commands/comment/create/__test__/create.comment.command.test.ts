import { makeCreateCommentCommand, CreateCommentCommandRequest } from '../create.comment.command';
import { Dependencies } from '@infrastructure/di';
import { validate } from '../create.comment.command.validator';
import { Response } from 'express';
import { IPostService } from '@application/interfaces';

// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  createComment: jest.fn(),
};

const dependenciesMock: Pick<Dependencies, 'postService'> = {
  postService: postServiceMock as IPostService,
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
    success(res: Response) {
      return res.json({ data: this.data, message: this.message, success: true });
    }
  },
}));

// Mock validate function
jest.mock('../create.comment.command.validator', () => ({
  validate: jest.fn(),
}));

describe('makeCreateCommentCommand', () => {
  const createCommentCommand = makeCreateCommentCommand(dependenciesMock);

  it('should create a comment successfully', async () => {
    // Mock command parameters
    const command: CreateCommentCommandRequest = {
      postId: '123',
      content: 'This is a comment',
    };

    // Mock postService.createComment result
    const mockComment = { id: '1', postId: '123', content: 'This is a comment' };
    (postServiceMock.createComment as jest.Mock).mockResolvedValue(mockComment);

    // Execute command
    await createCommentCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(postServiceMock.createComment).toHaveBeenCalledWith(command);
    expect(resMock.json).toHaveBeenCalledWith({
      data: mockComment,
      message: 'Comment created successfully',
      success: true,
    });
  });
});
