import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type LikeCommentCommandRequest = Readonly<{
  postId: string;
  commentId: string;
}>;

export function makeLikeCommentCommand({ postService }: Pick<Dependencies, 'postService'>) {
  return async function likeCommentCommand(command: LikeCommentCommandRequest, res: Response) {
    await postService.likeComment({
      postId: command.postId,
      commentId: command.commentId,
    });
    return new CustomResponse(null, 'Comment liked successfully').success(res);
  };
}
