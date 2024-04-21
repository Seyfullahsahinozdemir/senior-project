import { Dependencies } from '@infrastructure/di';
import { validate } from './delete.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { ValidationError } from 'yup';

export type DeleteCommandRequest = Readonly<{
  _id: string;
}>;

export function makeDeleteCommand({
  itemService,
  authService,
  itemRepository,
  imageRepository,
  searchService,
}: Pick<Dependencies, 'itemService' | 'authService' | 'itemRepository' | 'imageRepository' | 'searchService'>) {
  return async function deleteCommand(command: DeleteCommandRequest, res: Response) {
    await validate(command);
    const item = await itemRepository.findOne(command._id);
    if (item.createdBy != authService.currentUserId) {
      throw new Error('You cannot delete an item that does not belong to you.');
    }

    if (!item.image.fileId) {
      throw new ValidationError('Unexpected item.');
    }
    const response = await searchService.delete(item.image.fileId, item.image.mimetype);
    if (!response) {
      throw new Error('An error occurred while removing item from model.');
    }

    if (item.image.fileId) {
      // await imageService.deleteImage(item.image.fileId);
      const image = await imageRepository.find({ fileId: item.image.fileId });
      if (image.length === 1) {
        await imageRepository.delete(image[0]._id?.toString() as string);
      }
    } else {
      if (item.image.filename) {
        // const fileExtension = item.image.mimetype === MimetypeEnum.JPEG ? '.jpg' : '.png';

        // const fileId = await imageService.findFileIdByName(item.image.filename + fileExtension);
        // await imageService.deleteImage(fileId);
        const image = await imageRepository.find({ filename: item.image.filename });

        await imageRepository.delete(image[0]._id?.toString() as string);
      }
    }

    await itemService.deleteItem(command._id);
    return new CustomResponse(null, 'Item deleted successful').success(res);
  };
}
