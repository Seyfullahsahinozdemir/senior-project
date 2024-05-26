import { makeDeletePostCommand, DeletePostCommandRequest } from '../delete.post.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IPostService } from '@application/interfaces';
import { NotFoundException } from '@application/exceptions';

// Mock dependencies
const postServiceMock: Partial<IPostService> = {
  deletePost: jest.fn(),
};

const dependenciesMock: Pick<Dependencies, 'postService'> = {
  postService: postServiceMock as IPostService,
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

describe('makeDeletePostCommand', () => {
  const deletePostCommand = makeDeletePostCommand(dependenciesMock);

  it('should delete a post successfully', async () => {
    // Mock command parameters
    const command: DeletePostCommandRequest = {
      postId: '123',
    };

    // Mock postService.deletePost result
    (postServiceMock.deletePost as jest.Mock).mockResolvedValue(undefined);

    // Execute command
    await deletePostCommand(command, resMock as Response);

    // Assertions
    expect(postServiceMock.deletePost).toHaveBeenCalledWith(command.postId);
    expect(resMock.json).toHaveBeenCalledWith({
      data: null,
      message: 'Post deleted successfully',
      success: true,
    });
  });

  it('should throw NotFoundException if post does not exist', async () => {
    // Mock command parameters with invalid post ID
    const command: DeletePostCommandRequest = {
      postId: 'invalidPostId',
    };

    // Mock postService.deletePost to throw NotFoundException for invalid post ID
    (postServiceMock.deletePost as jest.Mock).mockRejectedValue(new NotFoundException('Post not found'));

    // Execute command and catch the error
    try {
      await deletePostCommand(command, resMock as Response);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Post not found');
    }
  });
});
