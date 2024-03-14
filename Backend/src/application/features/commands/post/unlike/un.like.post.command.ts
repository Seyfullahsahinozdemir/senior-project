import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type UnlikePostCommandRequest = Readonly<{
  postId: string;
}>;

export function makeUnlikePostCommand({ postService, authService }: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function unlikePostCommand(command: UnlikePostCommandRequest, res: Response) {
    await postService.unlikePost(command.postId, authService.currentUserId as string);
    return new CustomResponse(null, 'Post unliked successfully').success(res);
  };
}
