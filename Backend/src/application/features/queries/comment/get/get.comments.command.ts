import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetCommentsCommandRequest = Readonly<{
  pageIndex?: string;
  pageSize?: string;
  postId: string;
}>;

export function makeGetCommentsCommand({ postService }: Pick<Dependencies, 'postService'>) {
  return async function getCommentsCommand(command: GetCommentsCommandRequest, res: Response) {
    const comments = await postService.getComments(
      { pageIndex: command.pageIndex as string, pageSize: command.pageSize as string },
      command.postId,
    );
    return new CustomResponse(comments, 'Comments retrieved successfully').success(res);
  };
}
