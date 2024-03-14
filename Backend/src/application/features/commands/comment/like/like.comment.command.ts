import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type LikeCommentCommandRequest = Readonly<{
  postId: string;
  commentId: string;
}>;

export function makeLikeCommentCommand({
  postService,
  authService,
}: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function likeCommentCommand(command: LikeCommentCommandRequest, res: Response) {
    await postService.likeComment(
      {
        postId: command.postId,
        commentId: command.commentId,
      },
      authService.currentUserId as string,
    );
    return new CustomResponse(null, 'Comment liked successfully').success(res);
  };
}
