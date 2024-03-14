import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';

export function makeGetPostsCommand({ postService, authService }: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function getPostsCommand(command: PaginatedRequest, res: Response) {
    const posts = await postService.getPosts(command, authService.currentUserId as string);
    return new CustomResponse(posts, 'Posts retrieved successfully').success(res);
  };
}
