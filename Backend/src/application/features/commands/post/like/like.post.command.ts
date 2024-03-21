import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type LikePostCommandRequest = Readonly<{
  postId: string;
}>;

export function makeLikePostCommand({ postService }: Pick<Dependencies, 'postService'>) {
  return async function likePostCommand(command: LikePostCommandRequest, res: Response) {
    await postService.likePost(command.postId);
    return new CustomResponse(null, 'Post liked successfully').success(res);
  };
}
