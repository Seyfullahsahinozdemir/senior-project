import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { validate } from './create.comment.command.validator';

export type CreateCommentCommandRequest = Readonly<{
  postId: string;
  content: string;
}>;

export function makeCreateCommentCommand({ postService }: Pick<Dependencies, 'postService'>) {
  return async function createCommentCommand(command: CreateCommentCommandRequest, res: Response) {
    await validate(command);
    const post = await postService.createComment({
      postId: command.postId,
      content: command.content,
    });
    return new CustomResponse(post, 'Comment created successfully').success(res);
  };
}
