import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type LikePostCommandRequest = Readonly<{
  postId: string;
}>;

export function makeLikePostCommand({ postService, authService }: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function likePostCommand(command: LikePostCommandRequest, res: Response) {
    await postService.likePost(command.postId, authService.currentUserId as string);
    return new CustomResponse(null, 'Post liked successfully').success(res);
  };
}
