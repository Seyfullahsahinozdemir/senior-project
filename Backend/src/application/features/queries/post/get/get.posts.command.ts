import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';

export function makeGetPostsCommand({ postService }: Pick<Dependencies, 'postService'>) {
  return async function getPostsCommand(command: PaginatedRequest, res: Response) {
    const posts = await postService.getPosts(command);
    return new CustomResponse(posts, 'Posts retrieved successfully').success(res);
  };
}
