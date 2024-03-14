import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type DeleteCommentCommandRequest = Readonly<{
  postId: string;
  commentId: string;
}>;

export function makeDeleteCommentCommand({ postService }: Pick<Dependencies, 'postService'>) {
  return async function deleteCommentCommand(command: DeleteCommentCommandRequest, res: Response) {
    await postService.deleteComment({ postId: command.postId, commentId: command.commentId });
    return new CustomResponse(null, 'Comment deleted successfully').success(res);
  };
}
