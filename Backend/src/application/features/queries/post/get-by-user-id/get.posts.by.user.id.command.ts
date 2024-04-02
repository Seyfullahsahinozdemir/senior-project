import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { validate } from './get.posts.by.user.id.command.validator';
import { NotFoundException } from '@application/exceptions';

export function makeGetPostsByUserIdCommand({
  postService,
  userRepository,
  imageService,
  itemRepository,
  authService,
}: Pick<Dependencies, 'postService' | 'userRepository' | 'imageService' | 'itemRepository' | 'authService'>) {
  return async function getPostsByUserIdCommand(
    command: { pageIndex?: string; pageSize?: string; userId: string },
    res: Response,
  ) {
    await validate(command);
    const posts = await postService.getPostsByUserId(
      { pageIndex: command.pageIndex as string, pageSize: command.pageSize as string },
      command.userId,
    );

    const updatedPosts = [];
    for (const post of posts) {
      const likeCount = post.likes?.length;
      const commentCount = post.comments?.length;
      const user = await userRepository.findOne(post.createdBy as string);

      const updatedItems = [];
      for (const itemId of post.items) {
        const item = await itemRepository.findOne(itemId);
        if (!item) {
          throw new NotFoundException('Item not found.');
        }
        if (item.image.fileId) {
          updatedItems.push({ image: { filename: item.image.fileId } });
          continue;
        }

        const fileId = await imageService.findFileIdByName(`${item.image.filename}.jpg`);
        updatedItems.push({ image: { filename: fileId } });
      }

      const liked = post.likes?.includes(authService.currentUserId as string);

      updatedPosts.push({
        _id: post._id,
        content: post.content,
        createdAt: post.createdAt,
        likeCount,
        commentCount,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          image: user.preferences?.image,
        },
        items: updatedItems,
        comments: post.comments,
        liked: liked,
        me: user._id?.toString() === (authService.currentUserId as string) ? true : false,
      });
    }

    return new CustomResponse(updatedPosts, 'Posts retrieved successfully').success(res);
  };
}
