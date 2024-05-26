import { makeUnlikeCommentCommand, UnlikeCommentCommandRequest } from '../un.like.comment.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IPostService } from '@application/interfaces';

// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  unlikeComment: jest.fn(),
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

describe('makeUnlikeCommentCommand', () => {
  const unlikeCommentCommand = makeUnlikeCommentCommand(dependenciesMock);

  it('should unlike a comment successfully', async () => {
    // Mock command parameters
    const command: UnlikeCommentCommandRequest = {
      postId: '123',
      commentId: '456',
    };

    // Execute command
    await unlikeCommentCommand(command, resMock as Response);

    // Assertions
    expect(postServiceMock.unlikeComment).toHaveBeenCalledWith({
      postId: command.postId,
      commentId: command.commentId,
    });
    expect(resMock.json).toHaveBeenCalledWith({
      data: null,
      message: 'Comment unliked successfully',
      success: true,
    });
  });
});
