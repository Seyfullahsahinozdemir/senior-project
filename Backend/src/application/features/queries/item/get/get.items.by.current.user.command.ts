import { Dependencies } from '@infrastructure/di';
import { validate } from './get.items.by.current.user.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { MimetypeEnum } from '@application/enums/mimetype.enum';

export function makeGetItemsByCurrentUserCommand({
  itemService,
  userRepository,
  imageService,
}: Pick<Dependencies, 'itemService' | 'userRepository' | 'imageService'>) {
  return async function updateCommand(command: PaginatedRequest, res: Response) {
    await validate(command);
    const items = await itemService.getItemsByCurrentUser(command as PaginatedRequest);

    const updatedItems = [];
    for (const item of items) {
      const user = await userRepository.findOne(item.createdBy as string);

      if (!item.image.fileId) {
        const fileId = await imageService.findFileIdByName(
          (item.image.filename as string) + (item.image.mimetype == MimetypeEnum.JPEG ? '.jpg' : '.png'),
        );
        updatedItems.push({
          _id: item._id,
          urlName: item.urlName,
          description: item.description,
          title: item.title,
          topCategory: item.topCategory,
          subCategories: item.subCategories,
          image: { fileId: fileId, fileName: item.image.filename, mimetype: item.image.mimetype },
          createdAt: item.createdAt,
          createdBy: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      } else {
        updatedItems.push({
          _id: item._id,
          urlName: item.urlName,
          description: item.description,
          title: item.title,
          topCategory: item.topCategory,
          subCategories: item.subCategories,
          image: item.image,
          createdAt: item.createdAt,
          createdBy: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      }
    }

    return new CustomResponse(updatedItems, 'success').success(res);
  };
}
