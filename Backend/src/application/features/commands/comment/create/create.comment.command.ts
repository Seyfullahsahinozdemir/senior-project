import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type CreateCommentCommandRequest = Readonly<{
  postId: string;
  content: string;
}>;

export function makeCreateCommentCommand({
  postService,
  authService,
}: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function createCommentCommand(command: CreateCommentCommandRequest, res: Response) {
    const post = await postService.createComment(
      {
        postId: command.postId,
        content: command.content,
      },
      authService.currentUserId as string,
    );
    return new CustomResponse(post, 'Comment created successfully').success(res);
  };
}
