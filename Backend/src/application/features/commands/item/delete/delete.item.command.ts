import { Dependencies } from '@infrastructure/di';
import { validate } from './delete.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { MimetypeEnum } from '@application/enums/mimetype.enum';

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

    if (item.image.fileId) {
      await imageService.deleteImage(item.image.fileId);
    } else {
      if (item.image.filename) {
        const fileExtension = item.image.mimetype === MimetypeEnum.JPEG ? '.jpg' : '.png';

        const fileId = await imageService.findFileIdByName(item.image.filename + fileExtension);
        await imageService.deleteImage(fileId);
      }
    }

    await itemService.deleteItem(command._id);
    return new CustomResponse(null, 'Item deleted successful').success(res);
  };
}
