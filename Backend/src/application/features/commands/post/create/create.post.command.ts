import { Dependencies } from '@infrastructure/di';
import { validate } from './create.post.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { NotFoundException } from '@application/exceptions';

export type CreatePostCommandRequest = Readonly<{
  content: string;
  items: string[];
}>;

export function makeCreatePostCommand({
  postService,
  itemRepository,
  authService,
}: Pick<Dependencies, 'postService' | 'itemRepository' | 'authService'>) {
  return async function createPostCommand(command: CreatePostCommandRequest, res: Response) {
    await validate(command);

    for (const itemId of command.items) {
      const existingItem = await itemRepository.findOne(itemId);
      if (!existingItem) {
        throw new NotFoundException(`Item '${itemId}' does not exist.`);
      }
    }

    const post = await postService.createPost(
      {
        content: command.content,
        items: command.items,
      },
      authService.currentUserId as string,
    );

    return new CustomResponse(post, 'Post created successfully').created(res);
  };
}
