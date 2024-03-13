import { Dependencies } from '@infrastructure/di';
import { validate } from './delete.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type DeleteCommandRequest = Readonly<{
  _id: string;
}>;

export function makeDeleteCommand({
  itemService,
  authService,
  itemRepository,
  imageService,
}: Pick<Dependencies, 'itemService' | 'authService' | 'itemRepository' | 'imageService'>) {
  return async function deleteCommand(command: DeleteCommandRequest, res: Response) {
    await validate(command);
    const item = await itemRepository.findOne(command._id);
    if (item.createdBy != authService.currentUserId) {
      throw new Error('You cannot delete an item that does not belong to you.');
    }
    await imageService.deleteImage(item.image.filename);
    await itemService.deleteItem(command._id, authService.currentUserId as string);
    return new CustomResponse(null, 'Item deleted successful').success(res);
  };
}
