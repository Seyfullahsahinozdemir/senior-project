import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type UnlikeCommentCommandRequest = Readonly<{
  postId: string;
  commentId: string;
}>;

export function makeUnlikeCommentCommand({
  postService,
  authService,
}: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function unlikeCommentCommand(command: UnlikeCommentCommandRequest, res: Response) {
    await postService.unlikeComment(
      {
        postId: command.postId,
        commentId: command.commentId,
      },
      authService.currentUserId as string,
    );
    return new CustomResponse(null, 'Comment unliked successfully').success(res);
  };
}
