import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type DeletePostCommandRequest = Readonly<{
  postId: string;
}>;

export function makeDeletePostCommand({ postService, authService }: Pick<Dependencies, 'postService' | 'authService'>) {
  return async function deletePostCommand(command: DeletePostCommandRequest, res: Response) {
    await postService.deletePost(command.postId, authService.currentUserId as string);

    return new CustomResponse(null, 'Post deleted successfully').success(res);
  };
}
