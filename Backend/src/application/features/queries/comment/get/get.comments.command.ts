import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetCommentsCommandRequest = Readonly<{
  pageIndex?: string;
  pageSize?: string;
  postId: string;
}>;

export function makeGetCommentsCommand({
  postService,
  userRepository,
  authService,
}: Pick<Dependencies, 'postService' | 'userRepository' | 'authService'>) {
  return async function getCommentsCommand(command: GetCommentsCommandRequest, res: Response) {
    const comments = await postService.getComments(
      { pageIndex: command.pageIndex as string, pageSize: command.pageSize as string },
      command.postId,
    );

    const updatedComments = [];
    for (const comment of comments) {
      const user = await userRepository.findOne(comment.createdBy);

      updatedComments.push({
        _id: comment._id,
        content: comment.content,
        createdAt: comment.createdAt,
        createdBy: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          preferences: {
            image: user.preferences.image,
          },
        },
        likes: comment.likes,
        likeCount: comment.likes.length,
        liked: comment.likes.includes(authService.currentUserId as string),
        me: user._id?.toString() === (authService.currentUserId as string) ? true : false,
      });
    }

    return new CustomResponse(updatedComments, 'Comments retrieved successfully').success(res);
  };
}
