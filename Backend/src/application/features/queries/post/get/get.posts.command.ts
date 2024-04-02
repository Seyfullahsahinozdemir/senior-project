import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { validate } from './get.posts.command.validator';
import { NotFoundException } from '@application/exceptions';

export function makeGetPostsCommand({
  postService,
  userRepository,
  imageService,
  itemRepository,
}: Pick<Dependencies, 'postService' | 'userRepository' | 'imageService' | 'itemRepository'>) {
  return async function getPostsCommand(command: PaginatedRequest, res: Response) {
    await validate(command);
    const posts = await postService.getPosts(command);

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
      });
    }

    return new CustomResponse(updatedPosts, 'Posts retrieved successfully').success(res);
  };
}
